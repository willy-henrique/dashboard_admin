// Script para testar acesso ao Firebase Storage
import { initializeApp } from 'firebase/app';
import { getStorage, ref, listAll, getMetadata, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testStorageAccess() {
  try {
    console.log('🔧 Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    
    console.log('📁 Testando acesso à pasta Documentos...');
    const documentsRef = ref(storage, 'Documentos');
    const result = await listAll(documentsRef);
    
    console.log(`✅ Encontradas ${result.prefixes.length} pastas de usuários:`);
    
    for (const prefixRef of result.prefixes) {
      console.log(`\n👤 Usuário: ${prefixRef.name}`);
      
      try {
        const userRef = ref(storage, `Documentos/${prefixRef.name}`);
        const userResult = await listAll(userRef);
        
        console.log(`   📄 Documentos encontrados: ${userResult.items.length}`);
        
        for (const itemRef of userResult.items) {
          try {
            const metadata = await getMetadata(itemRef);
            const downloadURL = await getDownloadURL(itemRef);
            
            console.log(`   ✅ ${itemRef.name}`);
            console.log(`      📊 Tamanho: ${metadata.size} bytes`);
            console.log(`      📅 Criado: ${metadata.timeCreated}`);
            console.log(`      🔗 URL: ${downloadURL.substring(0, 50)}...`);
          } catch (error) {
            console.error(`   ❌ Erro ao processar ${itemRef.name}:`, error.message);
          }
        }
      } catch (error) {
        console.error(`   ❌ Erro ao acessar pasta do usuário ${prefixRef.name}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testStorageAccess();
