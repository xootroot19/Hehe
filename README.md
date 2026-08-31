# Carteira (Expo / Android APK)

Projeto Expo preparado para GitHub Actions.

## Credenciais locais de teste
- CPF: `123.456.789-00`
- Senha: `123456`
- PIN: `1234`

## Build no GitHub
1. Envie todos os arquivos deste projeto para um repositório GitHub.
2. Abra a aba **Actions**.
3. Escolha **Android Release APK**.
4. Toque em **Run workflow**.
5. Ao terminar, abra a execução e baixe o artifact **app-release-apk**.

## Observações
- A barra de status/notificações inicia oculta no Android via plugin `expo-status-bar` e também é mantida oculta em runtime.
- O splash nativo usa apenas a cor de fundo para evitar erros de processamento de PNG no prebuild. O splash visual/animado é feito em React Native logo em seguida.
- O app é uma carteira fictícia local e não se conecta a instituição financeira.
