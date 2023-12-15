/* Passo 01 - Importação dos componentes nativos e dos padrões de estado do ambiente de
desenvolvimento do React Native, bem como de outras bibliotecas necessárias: */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { styles } from './app_styles.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
// importação de bibliotecas extras para viabilização do anexo de imagens
import { ImagePicker } from './node_modules/react-native-image-picker';
//import * as ImageCropPicker from './node_modules/react-native-image-crop-picker/index.js';

/* Passo 02 - Configuração da logo, do cabeçalho do aplicativo e das variáveis, bem como dos
estados para renderização imediata da tela do usuário final: */
const Header = () => {
  return (
    <View style={styles.header}>
      <Image source={require('av2-livraria/assets/logo.png')} style={styles.logo} />
    </View>
  )
}

const LivrariaApp = () => {
  /* Passo 02 - 1ª parte - Configuração da lógica de CADASTRO através do uso de funções e
  propriedades, do gerenciamento de estados (states) e das funções de armazenamento local: */
  const [livros, setLivros] = useState([]);
  const [novoLivro, setNovoLivro] = useState({
    id: 1,
    nome: '',
    sinopse: '',
    imagemCapa: '',
  });

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      const livrosArmazenados = await AsyncStorage.getItem('livros');
      if (livrosArmazenados !== null) {
        setLivros(JSON.parse(livrosArmazenados));
      }
    } catch (error) {
      console.error('Erro ao carregar os livros: ', error);
    }
  };

  const handleAddLivro = async () => {
    if (novoLivro) {
      try {
        setLivros([...livros, novoLivro]);
        await AsyncStorage.setItem('livros', JSON.stringify([...livros, novoLivro]));
        setNovoLivro({
          id: novoLivro.id + 1,
          nome: '',
          sinopse: '',
          imagemCapa: '',
        });
      } catch (error) {
        console.error('Erro ao cadastrar as informações do livro: ', error);
      }
    }
  };

  const cadastrarImagem = () => {
    try {
      const options = {
        title: 'Selecione alguma imagem para a capa do livro',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, (response) => {
        // Por algum motivo a propriedade "showImagePicker" não é reconhecida
        if (response.didCancel) {
          console.log('Seleção de imagens cancelada');
        } else if (response.error) {
          console.log('Erro ao selecionar a imagem: ', response.error);
        } else {
          setNovoLivro({ ...novoLivro, imagemCapa: response.uri });
        }
      });
    } catch (error) {
      Alert.alert('Erro',
        'A opção de cadastrar imagens está em manutenção no momento. Por favor, tente mais tarde!'
      )
      console.log(error)
    }
  };

  const atualizarImagem = () => {
    try {
      const options = {
        title: 'Selecione outra imagem para a capa',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.showImagePicker(options, (response) => {
        // Por algum motivo a propriedade "showImagePicker" não é reconhecida
        if (response.didCancel) {
          console.log('Seleção de imagens cancelada');
        } else if (response.error) {
          console.log('Erro ao selecionar a imagem: ', response.error);
        } else {
          setEditedLivro({ ...editedLivro, imagemCapa: response.uri });
        }
      });
    } catch (error) {
      Alert.alert('Erro',
        'A opção de atualizar imagens está em manutenção no momento. Por favor, tente mais tarde!'
      )
      console.log(error)
    }
  };

  const handleDeleteLivro = async (livroId) => {
    try {
      const updatedLivros = livros.filter((livro) => livro.id !== livroId);
      setLivros(updatedLivros);
      await AsyncStorage.setItem('livros', JSON.stringify(updatedLivros));
    } catch (error) {
      console.error('Erro ao remover as informações do livro: ', error);
    }
  };

  const handleUpdateLivro = async (updatedLivro) => {
    try {
      const updatedLivros = livros.map((livro) =>
        livro.id === updatedLivro.id ? updatedLivro : livro
      );
      setLivros(updatedLivros);
      await AsyncStorage.setItem('livros', JSON.stringify(updatedLivros));
    } catch (error) {
      console.error('Erro ao atualizar as informações do livro: ', error);
    }
  };

  /* Passo 02 - 2ª parte - Estruturação em múltiplos componentes do formulário que permite
  a sequência de CADASTRO das informações dos livros do usuário final: */
  return (
    <View style={styles.container}>
      <ScrollView style={styles.rolagem}>
        <Header />
        <Text style={styles.saudacao}>{"Bem-vindo(a) ao seu estoque pessoal de informações sobre livros"}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputTitulo}
            placeholder="Insira o título do livro"
            value={novoLivro.nome}
            maxLength={25}
            onChangeText={(text) => setNovoLivro({ ...novoLivro, nome: text })}
          />
          <TouchableOpacity style={styles.botaoAnexarImg} onPress={cadastrarImagem}>
            <Text style={styles.textoBotaoAnexarImg}>Anexar capa</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            style={styles.inputSinopse}
            placeholder="Insira a sinopse ou o seu resumo sobre o livro"
            value={novoLivro.sinopse}
            maxLength={200}
            multiline={true}
            textAlignVertical="top"
            onChangeText={(text) => setNovoLivro({ ...novoLivro, sinopse: text })}
          />
          <TouchableOpacity style={styles.botaoCadastrar} onPress={handleAddLivro}>
            <Text style={styles.textoBotaoCadastrar}>Cadastrar informações</Text>
          </TouchableOpacity>
          <View style={styles.linhaDivisoria}></View>
          <Text style={styles.aviso}>{" Siga cadastrando. A sua lista de livros começa a partir daqui:"}</Text>
        </View>
        <FlatList
          data={livros}
          keyExtractor={(livro) => livro.id.toString()}
          renderItem={({ item }) => (
            <LivroComponent
              livro={item}
              onDelete={handleDeleteLivro}
              onUpdate={handleUpdateLivro}
            />
          )}
        />
      </ScrollView>
    </View>
  );
};

const LivroComponent = ({ livro, onDelete, onUpdate }) => {
  /* Passo 03 - 1ª parte - Configuração da lógica dos fluxos de EDIÇÃO e DELEÇÃO através do
  uso de funções e propriedades e do gerenciamento de estados (states): 
  
  OBS: Nesse caso, as funções de armazenamento local já estão embutidas nos componentes
  filhos do LivroComponent o qual está contido na lista de registros dos livros: */
  const [isEditing, setEditing] = useState(false);
  const [editedLivro, setEditedLivro] = useState(livro);

  const handleUpdate = () => {
    onUpdate(editedLivro);
    setEditing(false);
  };

  /* Passo 03 - 2ª parte - Estruturação em múltiplos componentes do formulário que permite
  a sequência de EDIÇÃO e DELEÇÃO das informações dos livros do usuário final: */
  return (
    <SafeAreaView>
      <View style={styles.livroContainer}>
        {isEditing ? (
          <View>
            <View style={styles.atualizacaoContainer}>
              <TextInput
                style={styles.inputUpdateTitulo}
                placeholder="Atualize o título"
                placeholderTextColor="white"
                value={editedLivro.nome}
                maxLength={25}
                onChangeText={(text) => setEditedLivro({ ...editedLivro, nome: text })}
              />
              <TouchableOpacity style={styles.botaoAtualizarAnexoImg} /*onPress={atualizarImagem}*/>
                <Text style={styles.textoAtualizarAnexoImg}>Atualizar capa</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TextInput
                style={styles.inputUpdateSinopse}
                placeholder="Atualize a sinopse ou o seu resumo do livro"
                placeholderTextColor="white"
                value={editedLivro.sinopse}
                maxLength={200}
                multiline={true}
                textAlignVertical="top"
                onChangeText={(text) => setEditedLivro({ ...editedLivro, sinopse: text })}
              />
            </View>
            <TouchableOpacity style={styles.botaoAtualizar} onPress={handleUpdate}>
              <Text style={styles.textoBotaoAtualizar}>Atualizar informações</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.livroContainerCabecalho}>
              <Text style={styles.titulo}>{'Livro #' + livro.id + ':'}</Text>
              <View style={styles.livroContainerCapa}>
                <Text>{"Anexos em manutenção"}</Text>
                {/* Quando o a função de anexar e atualizar capa estiver corrigida,
                então substituir este comentário e o <Text> anterior por:
                <Image style={styles.imagemCapa} source={{ uri: livro.imagemCapa }} /> */}
              </View>
              <Text style={styles.titulo}>{livro.nome}</Text>
            </View>
            <View style={styles.livroContainerDescricao}>
              <Text style={styles.sinopse}>{livro.sinopse}</Text>
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.botaoEditar} onPress={() => setEditing(true)}>
                <Text style={styles.textoBotaoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoExcluir} onPress={() => onDelete(livro.id)}>
                <Text style={styles.textoBotaoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

/* Passo 04 - Após a estruturação e o funcionamento lógico da sequência CRUD, o arquivo é
exportado para execução via Expo Go. A estilização está num arquivo separado na mesma pasta
(./app_styles.js): */
export default LivrariaApp;