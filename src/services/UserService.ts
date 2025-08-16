import { User, IUser } from '../models/User';
import { db } from '../utils/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';

export class UserService {
  private collectionName = 'users';

  // Criar novo usuário
  async createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      // Verificar se email já existe
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Criptografar senha
      const hashedPassword = await User.hashPassword(userData.password);

      const user = new User({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const docRef = await addDoc(collection(db, this.collectionName), user);
      user.id = docRef.id;

      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error}`);
    }
  }

  // Buscar usuário por ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return new User({ id: docSnap.id, ...docSnap.data() });
      }
      return null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${error}`);
    }
  }

  // Buscar usuário por email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('email', '==', email),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        if (docSnap) {
          return new User({ id: docSnap.id, ...docSnap.data() });
        }
      }
      return null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error}`);
    }
  }

  // Autenticar usuário
  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) {
        return null;
      }

      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Registrar login
      user.recordLogin();
      await this.updateUser(user.id, { 
        lastLogin: user.lastLogin || new Date(), 
        updatedAt: user.updatedAt 
      });

      return user;
    } catch (error) {
      throw new Error(`Erro na autenticação: ${error}`);
    }
  }

  // Listar usuários com paginação
  async getUsers(
    _page: number = 1,
    limitCount: number = 10,
    filters?: {
      role?: string;
      isActive?: boolean;
      department?: string;
    }
  ): Promise<{ users: User[]; total: number; hasMore: boolean }> {
    try {
      let q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

      // Aplicar filtros
      if (filters?.role) {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters?.department) {
        q = query(q, where('department', '==', filters.department));
      }

      // Aplicar paginação
      q = query(q, limit(limitCount + 1)); // +1 para verificar se há mais páginas

      const querySnapshot = await getDocs(q);
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        users.push(new User({ id: doc.id, ...doc.data() }));
      });

      const hasMore = users.length > limitCount;
      if (hasMore) {
        users.pop(); // Remove o item extra
      }

      return {
        users,
        total: users.length,
        hasMore
      };
    } catch (error) {
      throw new Error(`Erro ao listar usuários: ${error}`);
    }
  }

  // Atualizar usuário
  async updateUser(id: string, updateData: Partial<Omit<IUser, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      
      // Se estiver atualizando a senha, criptografar
      if (updateData.password) {
        updateData.password = await User.hashPassword(updateData.password);
      }

      updateData.updatedAt = new Date();
      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error}`);
    }
  }

  // Deletar usuário
  async deleteUser(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error}`);
    }
  }

  // Ativar/Desativar usuário
  async toggleUserStatus(id: string): Promise<void> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (user.isActive) {
        user.deactivate();
      } else {
        user.activate();
      }

      await this.updateUser(id, { isActive: user.isActive, updatedAt: user.updatedAt });
    } catch (error) {
      throw new Error(`Erro ao alterar status do usuário: ${error}`);
    }
  }

  // Buscar usuários por departamento
  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('department', '==', department),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);

      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push(new User({ id: doc.id, ...doc.data() }));
      });

      return users;
    } catch (error) {
      throw new Error(`Erro ao buscar usuários por departamento: ${error}`);
    }
  }

  // Obter estatísticas de usuários
  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<string, number>;
    byDepartment: Record<string, number>;
  }> {
    try {
      const users = await this.getUsers(1, 1000); // Buscar todos os usuários
      
      const stats = {
        total: users.users.length,
        active: users.users.filter(u => u.isActive).length,
        inactive: users.users.filter(u => !u.isActive).length,
        byRole: {} as Record<string, number>,
        byDepartment: {} as Record<string, number>
      };

      // Contar por role
      users.users.forEach(user => {
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        if (user.department) {
          stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error}`);
    }
  }
}
