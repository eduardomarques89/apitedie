# App Tedie

Aplicativo do Tedie construído utilizando React Native, Expo e JavaScript.

### Instalando dependencias 
Certifique-se de ter Node.js e Yarn instalados em seu ambiente e instale a Expo CLI.

```
$ yarn global add expo-cli
```

Instale as dependencias do projeto na raiz.
```
$ yarn install
```

### Rodando o projeto
Para iniciar o projeto, basta executar o comando abaixo e utilizar o aplicativo do expo em seu smartphone para acompanhar as mudanças em tempo real.
```
$ expo start
```

É possível rodar o projeto diretamente em um emulador ou dispositivo android ou iOS utilizando
```
$ expo start --android
$ expo start --ios
```

### Build
Para compilar o projeto em um pacote nativo, basta utilizar:

```
$ expo build:android
$ expo build:ios
```
O projeto será compilado pelo Expo, será necessário ter uma conta para baixar os artefatos gerados. Para mais detalhes, use esta [referência](https://docs.expo.io/distribution/building-standalone-apps/).

### Libs utilizadas

[React Navigation Bottom Tabs](https://reactnavigation.org/docs/tab-based-navigation/)
[React Navigation Stack](https://reactnavigation.org/docs/stack-navigator/)
[Axios](https://github.com/axios/axios)
[Expo](https://expo.io)
[Expo Constants](https://docs.expo.io/versions/latest/sdk/constants/)
[Expo Status Bar](https://docs.expo.io/versions/latest/sdk/status-bar/)
[React Native Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler)
[React Native QrCode SVG](https://www.npmjs.com/package/react-native-qrcode-svg)
[React Native Ratings](https://www.npmjs.com/package/react-native-ratings)
[React Native Reanimated](https://github.com/software-mansion/react-native-reanimated)
[React Native Skeleton Content](https://www.npmjs.com/package/react-native-skeleton-content)
[React Native SVG](https://www.npmjs.com/package/react-native-skeleton-content)
[React Native TextInput Effects](https://github.com/halilb/react-native-textinput-effects)
[Reanimated Bottom Sheet](https://github.com/osdnk/react-native-reanimated-bottom-sheet)


### To-do

- [ ] Integração Back-End
  - [ ] Lista de produtos com busca
  - [ ] Ofertas
  - [ ] Endereços
	- [ ] Busca de endereço por lat, long (localização)
	- [ ] Busca de endereço por CEP
	- [ ] Perfil do Usuário
	- [ ] Editar perfil
	- [ ] Pedidos
	- [ ] Cupons
	- [ ] Checkout
	- [ ] Login
	- [ ] Cadastro
	- [ ] Cadastro de cartão
	- [ ] Avaliação
	- [ ] Tickets
	- [ ] Ticket
	- [ ] Enviar mensagem no ticket
	- [ ] Notificações

- [ ] Ajustes de lógica
  - [ ] Lógica de múltiplos carrinhos
  - [ ] Filtros
	- [ ] Repetir pedido
	- [ ] Tratamento de erros