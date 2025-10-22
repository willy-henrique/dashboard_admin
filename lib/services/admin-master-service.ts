import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore"
import { db } from "@/lib/firebase"

export interface AdminMaster {
  id: string
  email: string
  senhaHash: string
  nome: string
  permissoes: {
    dashboard: boolean
    controle: boolean
    gestaoUsuarios: boolean
    gestaoPedidos: boolean
    financeiro: boolean
    relatorios: boolean
    configuracoes: boolean
  }
}

export interface MasterUser {
  id: string
  email: string
  nome: string
  permissoes: {
    dashboard: boolean
    controle: boolean
    gestaoUsuarios: boolean
    gestaoPedidos: boolean
    financeiro: boolean
    relatorios: boolean
    configuracoes: boolean
  }
}

export class AdminMasterService {
  // Função para hash de senha (simplificada para demonstração)
  private static hashPassword(password: string): string {
    return Buffer.from(password).toString('base64')
  }

  // Verificar credenciais do AdminMaster
  static async authenticateMaster(email: string, password: string): Promise<AdminMaster | null> {
    try {
      const adminMasterRef = doc(db, 'adminmaster', 'master')
      const adminMasterDoc = await getDoc(adminMasterRef)
      
      if (!adminMasterDoc.exists()) {
        throw new Error('AdminMaster não encontrado')
      }

      const adminData = adminMasterDoc.data() as AdminMaster
      const hashedPassword = this.hashPassword(password)

      if (adminData.email !== email || adminData.senhaHash !== hashedPassword) {
        throw new Error('Credenciais inválidas')
      }

      return {
        id: adminMasterDoc.id,
        ...adminData
      }
    } catch (error) {
      console.error('Erro na autenticação master:', error)
      throw error
    }
  }

  // Criar AdminMaster inicial
  static async createAdminMaster(data: Omit<AdminMaster, 'id'>): Promise<void> {
    try {
      const adminMasterRef = doc(db, 'adminmaster', 'master')
      await setDoc(adminMasterRef, data)
    } catch (error) {
      console.error('Erro ao criar AdminMaster:', error)
      throw error
    }
  }

  // Buscar AdminMaster
  static async getAdminMaster(): Promise<AdminMaster | null> {
    try {
      const adminMasterRef = doc(db, 'adminmaster', 'master')
      const adminMasterDoc = await getDoc(adminMasterRef)
      
      if (!adminMasterDoc.exists()) {
        return null
      }

      return {
        id: adminMasterDoc.id,
        ...adminMasterDoc.data()
      } as AdminMaster
    } catch (error) {
      console.error('Erro ao buscar AdminMaster:', error)
      throw error
    }
  }

  // Listar usuários da subcoleção
  static async getUsuarios(adminId: string): Promise<MasterUser[]> {
    try {
      const usuariosRef = collection(db, 'adminmaster', adminId, 'usuarios')
      const usuariosSnapshot = await getDocs(usuariosRef)
      
      const usuarios: MasterUser[] = []
      usuariosSnapshot.forEach((doc) => {
        const data = doc.data()
        usuarios.push({
          id: doc.id,
          email: data.email,
          nome: data.nome,
          permissoes: data.permissoes
        })
      })
      
      return usuarios
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }
  }

  // Adicionar usuário
  static async addUsuario(adminId: string, usuario: Omit<MasterUser, 'id'>): Promise<string> {
    try {
      const usuariosRef = collection(db, 'adminmaster', adminId, 'usuarios')
      const docRef = await addDoc(usuariosRef, usuario)
      return docRef.id
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
      throw error
    }
  }

  // Atualizar usuário
  static async updateUsuario(adminId: string, usuarioId: string, data: Partial<MasterUser> | MasterUser['permissoes']): Promise<void> {
    try {
      const usuarioRef = doc(db, 'adminmaster', adminId, 'usuarios', usuarioId)
      // Se vier apenas o objeto de permissões, atualiza o campo aninhado 'permissoes'
      if (
        data &&
        !('email' in (data as any)) &&
        !('nome' in (data as any)) &&
        !('permissoes' in (data as any))
      ) {
        await updateDoc(usuarioRef, { permissoes: data })
      } else {
        await updateDoc(usuarioRef, data as any)
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      throw error
    }
  }

  // Deletar usuário
  static async deleteUsuario(adminId: string, usuarioId: string): Promise<void> {
    try {
      const usuarioRef = doc(db, 'adminmaster', adminId, 'usuarios', usuarioId)
      await deleteDoc(usuarioRef)
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      throw error
    }
  }

  // Buscar usuário por email
  static async getUsuarioByEmail(email: string): Promise<MasterUser | null> {
    try {
      const usuariosRef = collection(db, 'adminmaster', 'master', 'usuarios')
      const q = query(usuariosRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }

      const doc = querySnapshot.docs[0]
      const data = doc.data()
      
      return {
        id: doc.id,
        email: data.email,
        nome: data.nome,
        permissoes: data.permissoes
      }
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error)
      throw error
    }
  }

  // Verificar se email já existe
  static async emailExists(email: string): Promise<boolean> {
    try {
      const usuario = await this.getUsuarioByEmail(email)
      return usuario !== null
    } catch (error) {
      console.error('Erro ao verificar email:', error)
      return false
    }
  }

  // Atualizar senha do AdminMaster
  static async updateMasterPassword(newPassword: string): Promise<void> {
    try {
      const hashedPassword = this.hashPassword(newPassword)
      const adminMasterRef = doc(db, 'adminmaster', 'master')
      await updateDoc(adminMasterRef, { senhaHash: hashedPassword })
    } catch (error) {
      console.error('Erro ao atualizar senha master:', error)
      throw error
    }
  }

  // Verificar se AdminMaster existe
  static async masterExists(): Promise<boolean> {
    try {
      const adminMaster = await this.getAdminMaster()
      return adminMaster !== null
    } catch (error) {
      console.error('Erro ao verificar se master existe:', error)
      return false
    }
  }
}
