import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, KeyboardAvoidingView, Modal, Platform, Pressable,
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput,
  View, useWindowDimensions,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


const PINK = '#ed1761';
const PINK_DARK = '#d90d55';
const PINK_SOFT = '#fce7ef';
const TEXT = '#111111';
const MUTED = '#777777';

const VALID_CPF = '12345678900';
const VALID_PASSWORD = '123456';
const VALID_PIN = '1234';

const onlyNumbers = (v) => v.replace(/\D/g, '');

function formatCpf(value) {
  const d = onlyNumbers(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
}

function WalletLogo({ size = 80, inverted = false }) {
  return (
    <View style={[styles.logo, {
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: inverted ? '#fff' : PINK,
    }]}>
      <MaterialCommunityIcons
        name="wallet-outline" size={size * .48}
        color={inverted ? PINK : '#fff'}
      />
    </View>
  );
}

function AppSplash({ onFinish }) {
  const scale = useRef(new Animated.Value(.72)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(16)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 320, useNativeDriver: true }),
        Animated.timing(textY, {
          toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]),
      Animated.delay(850),
      Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start(onFinish);
  }, []);

  return (
    <Animated.View style={[styles.splash, { opacity: fade }]}>
      <StatusBar hidden />
      <View style={styles.orbA} /><View style={styles.orbB} /><View style={styles.orbC} />
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <WalletLogo size={126} inverted />
      </Animated.View>
      <Animated.View style={{ alignItems: 'center', opacity: textOpacity, transform: [{ translateY: textY }] }}>
        <Text style={styles.splashTitle}>carteira</Text>
        <Text style={styles.splashSubtitle}>simples, rápida e do seu jeito</Text>
      </Animated.View>
      <View style={styles.splashDots}>
        <View style={styles.dotActive} /><View style={styles.dot} /><View style={styles.dot} />
      </View>
    </Animated.View>
  );
}

function LoginScreen({ onSuccess }) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const shake = useRef(new Animated.Value(0)).current;

  const animateError = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: -7, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 7, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -5, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 5, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const login = () => {
    if (!cpf || !password) {
      setError('Preencha o CPF e a senha.');
      animateError();
      return;
    }
    if (onlyNumbers(cpf) !== VALID_CPF || password !== VALID_PASSWORD) {
      setError('CPF ou senha incorretos.');
      animateError();
      return;
    }
    setError('');
    onSuccess();
  };

  return (
    <SafeAreaView style={styles.whiteScreen}>
      <StatusBar hidden />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.loginScroll} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.loginContent, { transform: [{ translateX: shake }] }]}>
            <View style={styles.loginHeader}>
              <WalletLogo size={74} />
              <Text style={styles.loginTitle}>Bem-vindo</Text>
              <Text style={styles.loginSubtitle}>Entre para acessar sua carteira</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>CPF</Text>
              <View style={[styles.inputBox, error && styles.inputBoxError]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={22} color="#777" />
                <TextInput
                  value={cpf}
                  onChangeText={(v) => { setCpf(formatCpf(v)); setError(''); }}
                  placeholder="000.000.000-00" placeholderTextColor="#aaa"
                  keyboardType="number-pad" maxLength={14} style={styles.input}
                />
              </View>

              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputBox, error && styles.inputBoxError]}>
                <Ionicons name="lock-closed-outline" size={21} color="#777" />
                <TextInput
                  value={password}
                  onChangeText={(v) => { setPassword(v); setError(''); }}
                  placeholder="Digite sua senha" placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword} style={styles.input}
                />
                <Pressable hitSlop={12} onPress={() => setShowPassword(v => !v)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#777" />
                </Pressable>
              </View>

              <View style={styles.errorArea}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <Pressable onPress={login} style={({pressed}) => [styles.loginButton, pressed && styles.pressed]}>
                <Text style={styles.loginButtonText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={21} color="#fff" />
              </Pressable>
              <Text style={styles.forgot}>Esqueci minha senha</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PinKey({ label, icon, onPress, size }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: .88, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.key, {
        width: size, height: size, borderRadius: size / 2, transform: [{ scale }],
      }]}>
        {icon || <Text style={styles.keyText}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
}

function PinScreen({ name, onSuccess, onBack }) {
  const { width, height } = useWindowDimensions();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;
  const compact = height < 700;
  const keySize = Math.min(82, Math.max(62, width * .19));

  const wrongPin = () => {
    setError(true);
    Animated.sequence([
      Animated.timing(shake, { toValue: -9, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 9, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
    setTimeout(() => { setPin(''); setError(false); }, 650);
  };

  const typeNumber = (number) => {
    if (pin.length >= 4 || success) return;
    const next = pin + number;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === VALID_PIN) {
          setSuccess(true);
          setTimeout(onSuccess, 450);
        } else {
          wrongPin();
        }
      }, 120);
    }
  };

  return (
    <SafeAreaView style={styles.whiteScreen}>
      <StatusBar hidden />
      <View style={styles.pinScreen}>
        <View style={[styles.pinHeader, compact && { height: 70 }]}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#222" />
          </Pressable>
          <WalletLogo size={compact ? 50 : 60} />
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.pinTitleArea}>
          <Text style={styles.pinTitle}>Olá, {name}!</Text>
          <Text style={styles.pinSubtitle}>Digite sua senha para continuar</Text>
        </View>

        <Animated.View style={[styles.pinDots, { transform: [{ translateX: shake }] }]}>
          {[0,1,2,3].map(i => (
            <View key={i} style={[
              styles.pinDot, i < pin.length && styles.pinDotFilled,
              error && styles.pinDotError, success && styles.pinDotSuccess,
            ]} />
          ))}
        </Animated.View>

        <View style={styles.pinMessageArea}>
          {error ? <Text style={styles.pinErrorText}>Senha incorreta</Text> : null}
          {success ? <Ionicons name="checkmark-circle" size={31} color="#22a06b" /> : null}
        </View>

        <View style={[styles.keypad, { width: Math.min(320, width - 44) }]}>
          {['1','2','3','4','5','6','7','8','9'].map(n => (
            <PinKey key={n} label={n} size={keySize} onPress={() => typeNumber(n)} />
          ))}
          <PinKey size={keySize} onPress={() => {}} icon={
            <MaterialCommunityIcons name="fingerprint" size={36} color={PINK} />
          } />
          <PinKey label="0" size={keySize} onPress={() => typeNumber('0')} />
          <PinKey size={keySize} onPress={() => setPin(v => v.slice(0,-1))} icon={
            <Ionicons name="backspace-outline" size={30} color={PINK} />
          } />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Shortcut({ icon, title }) {
  return (
    <Pressable style={styles.shortcut}>
      <View style={styles.shortcutCircle}>
        <MaterialCommunityIcons name={icon} size={27} color="#111" />
      </View>
      <Text style={styles.shortcutText}>{title}</Text>
    </Pressable>
  );
}

function MenuOption({ icon, title, subtitle, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.menuOption}>
      <View style={styles.menuOptionIcon}>
        <Ionicons name={icon} size={22} color={PINK} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuOptionTitle}>{title}</Text>
        <Text style={styles.menuOptionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#aaa" />
    </Pressable>
  );
}

function AccountMenu({ visible, onClose, onLock, onLogout }) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.menuSheet} onPress={() => {}}>
          <View style={styles.menuHandle} />
          <Text style={styles.menuTitle}>Minha carteira</Text>
          <MenuOption icon="lock-closed-outline" title="Bloquear"
            subtitle="Solicitar a senha de desbloqueio" onPress={onLock} />
          <MenuOption icon="log-out-outline" title="Sair"
            subtitle="Voltar para a tela de acesso" onPress={onLogout} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function HomeScreen({ name, onLock, onLogout }) {
  const [showBalance, setShowBalance] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.homeSafe}>
      <StatusBar hidden />
      <View style={styles.homeRoot}>
        <View style={styles.homeHeader}>
          <View style={styles.homeTop}>
            <Pressable style={styles.avatar} onPress={() => setMenuVisible(true)}>
              <Feather name="user" size={27} color="#fff" />
            </Pressable>
            <View style={styles.headerActions}>
              <Pressable style={styles.headerIcon} onPress={() => setShowBalance(v => !v)}>
                <Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={25} color="#fff" />
              </Pressable>
              <Pressable style={styles.headerIcon}>
                <Ionicons name="help-circle-outline" size={25} color="#fff" />
              </Pressable>
              <Pressable style={styles.headerIcon}>
                <Ionicons name="person-add-outline" size={25} color="#fff" />
              </Pressable>
            </View>
          </View>
          <Text style={styles.greeting}>Olá, {name}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 105 }}>
          <View style={styles.accountSection}>
            <View style={styles.accountTitleRow}>
              <Text style={styles.accountTitle}>Conta</Text>
              <Ionicons name="chevron-forward" size={23} color="#222" />
            </View>
            <Text style={styles.balance}>{showBalance ? 'R$ 4.280,75' : '••••'}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcuts}>
            <Shortcut icon="qrcode-scan" title="Área Pix" />
            <Shortcut icon="barcode" title="Pagar" />
            <Shortcut icon="hand-coin-outline" title={'Pegar\nemprestado'} />
            <Shortcut icon="bank-transfer-out" title="Transferir" />
            <Shortcut icon="cellphone" title="Recarga" />
          </ScrollView>

          <Pressable style={styles.cardsButton}>
            <MaterialCommunityIcons name="credit-card-outline" size={25} color={TEXT} />
            <Text style={styles.cardsButtonText}>Meus cartões</Text>
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoCards}>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                Você tem até <Text style={styles.pinkText}>{showBalance ? 'R$ 1.498,26' : '••••'}</Text> disponíveis.
              </Text>
              <Text style={styles.infoAction}>Saiba mais</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>Organize seus gastos e acompanhe tudo em um só lugar.</Text>
              <Text style={styles.infoAction}>Conferir</Text>
            </View>
          </ScrollView>

          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cartão</Text>
            <View style={styles.creditRow}>
              <View>
                <Text style={styles.creditLabel}>Limite disponível</Text>
                <Text style={styles.creditValue}>{showBalance ? 'R$ 2.650,00' : '••••'}</Text>
              </View>
              <View style={styles.cardIcon}>
                <MaterialCommunityIcons name="credit-card-chip-outline" size={28} color={PINK} />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <View style={[styles.bottomButton, styles.bottomActive]}>
            <Ionicons name="swap-horizontal" size={25} color={PINK} />
          </View>
          <View style={styles.bottomButton}><Ionicons name="cash-outline" size={25} color="#777" /></View>
          <View style={styles.bottomButton}><Ionicons name="bag-outline" size={25} color="#777" /></View>
        </View>
      </View>

      <AccountMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onLock={() => { setMenuVisible(false); onLock(); }}
        onLogout={() => { setMenuVisible(false); onLogout(); }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash');
  const name = 'Franciele';

  if (screen === 'splash') return <AppSplash onFinish={() => setScreen('login')} />;
  if (screen === 'login') return <LoginScreen onSuccess={() => setScreen('pin')} />;
  if (screen === 'pin') {
    return <PinScreen name={name} onSuccess={() => setScreen('home')} onBack={() => setScreen('login')} />;
  }
  return <HomeScreen name={name} onLock={() => setScreen('pin')} onLogout={() => setScreen('login')} />;
}

const styles = StyleSheet.create({
  whiteScreen: { flex: 1, backgroundColor: '#fff' },
  logo: { alignItems: 'center', justifyContent: 'center' },
  splash: { flex: 1, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbA: { position: 'absolute', width: 330, height: 330, borderRadius: 165, backgroundColor: 'rgba(255,255,255,.05)', right: -140, top: -100 },
  orbB: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(255,255,255,.04)', left: -100, bottom: -55 },
  orbC: { position: 'absolute', width: 110, height: 110, borderRadius: 55, borderWidth: 16, borderColor: 'rgba(255,255,255,.035)', right: 35, bottom: 130 },
  splashTitle: { marginTop: 24, color: '#fff', fontSize: 52, lineHeight: 58, fontWeight: '900', letterSpacing: -2 },
  splashSubtitle: { marginTop: 7, fontSize: 15, color: 'rgba(255,255,255,.9)' },
  splashDots: { position: 'absolute', bottom: 45, flexDirection: 'row', gap: 12 },
  dotActive: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#fff' },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,.3)' },

  loginScroll: { flexGrow: 1 },
  loginContent: { flex: 1, paddingHorizontal: 26, paddingTop: 45, paddingBottom: 25 },
  loginHeader: { alignItems: 'center' },
  loginTitle: { marginTop: 21, fontSize: 29, fontWeight: '800', color: TEXT },
  loginSubtitle: { marginTop: 6, color: MUTED, fontSize: 14 },
  form: { marginTop: 42 },
  label: { marginLeft: 3, marginBottom: 8, fontSize: 14, fontWeight: '700', color: '#333' },
  inputBox: { height: 59, borderRadius: 17, borderWidth: 1.2, borderColor: '#e2e2e2', backgroundColor: '#fafafa', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 18 },
  inputBoxError: { borderColor: '#e3a19c' },
  input: { flex: 1, height: '100%', marginLeft: 11, fontSize: 16, color: TEXT },
  errorArea: { minHeight: 28 },
  errorText: { color: '#d93025', fontSize: 13 },
  loginButton: { height: 59, borderRadius: 30, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  pressed: { backgroundColor: PINK_DARK, transform: [{ scale: .985 }] },
  loginButtonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  forgot: { marginTop: 23, textAlign: 'center', fontSize: 14, fontWeight: '700', color: PINK },

  pinScreen: { flex: 1, paddingHorizontal: 22 },
  pinHeader: { height: 96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pinTitleArea: { alignItems: 'center', marginTop: 5 },
  pinTitle: { color: TEXT, fontSize: 27, fontWeight: '800' },
  pinSubtitle: { marginTop: 7, color: MUTED, fontSize: 14 },
  pinDots: { marginTop: 32, flexDirection: 'row', justifyContent: 'center', gap: 27 },
  pinDot: { width: 17, height: 17, borderRadius: 9, borderWidth: 2, borderColor: PINK },
  pinDotFilled: { backgroundColor: PINK },
  pinDotError: { borderColor: '#d93025', backgroundColor: '#d93025' },
  pinDotSuccess: { borderColor: '#22a06b', backgroundColor: '#22a06b' },
  pinMessageArea: { height: 43, alignItems: 'center', justifyContent: 'center' },
  pinErrorText: { color: '#d93025', fontSize: 13, fontWeight: '600' },
  keypad: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 15 },
  key: { backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  keyText: { fontSize: 30, fontWeight: '500', color: TEXT },

  homeSafe: { flex: 1, backgroundColor: PINK },
  homeRoot: { flex: 1, backgroundColor: '#fff' },
  homeHeader: { backgroundColor: PINK, paddingHorizontal: 23, paddingTop: 17, paddingBottom: 26 },
  homeTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: PINK_DARK, alignItems: 'center', justifyContent: 'center' },
  headerActions: { marginLeft: 'auto', flexDirection: 'row', gap: 3 },
  headerIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  greeting: { marginTop: 26, color: '#fff', fontSize: 20, fontWeight: '700' },
  accountSection: { paddingHorizontal: 23, paddingTop: 26, paddingBottom: 23 },
  accountTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  accountTitle: { fontSize: 21, fontWeight: '800', color: TEXT },
  balance: { marginTop: 11, fontSize: 20, fontWeight: '700', color: TEXT },
  shortcuts: { paddingHorizontal: 16, gap: 8 },
  shortcut: { width: 85, alignItems: 'center' },
  shortcutCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  shortcutText: { marginTop: 8, textAlign: 'center', fontSize: 12, lineHeight: 16, color: '#222' },
  cardsButton: { marginHorizontal: 22, marginTop: 27, height: 64, borderRadius: 17, backgroundColor: PINK_SOFT, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 19, gap: 14 },
  cardsButtonText: { fontSize: 16, fontWeight: '700', color: TEXT },
  infoCards: { paddingHorizontal: 22, paddingTop: 20, gap: 14 },
  infoCard: { width: 265, minHeight: 142, borderRadius: 18, backgroundColor: PINK_SOFT, padding: 19 },
  infoText: { fontSize: 16, lineHeight: 23, color: TEXT },
  pinkText: { color: PINK, fontWeight: '700' },
  infoAction: { marginTop: 'auto', paddingTop: 14, color: PINK, fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eee', marginTop: 28 },
  section: { padding: 23 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: TEXT },
  creditRow: { marginTop: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  creditLabel: { color: '#777', fontSize: 13 },
  creditValue: { marginTop: 5, fontSize: 18, fontWeight: '700', color: TEXT },
  cardIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  bottomNav: { position: 'absolute', bottom: 16, left: 63, right: 63, height: 65, borderRadius: 33, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', shadowColor: '#000', shadowOpacity: .14, shadowRadius: 16, shadowOffset: { width: 0, height: 5 }, elevation: 9 },
  bottomButton: { width: 47, height: 47, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bottomActive: { backgroundColor: PINK_SOFT },

  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.34)' },
  menuSheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 11, paddingBottom: 27 },
  menuHandle: { width: 42, height: 5, borderRadius: 4, backgroundColor: '#ddd', alignSelf: 'center' },
  menuTitle: { marginTop: 22, marginBottom: 14, fontSize: 21, fontWeight: '800', color: TEXT },
  menuOption: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 13, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  menuOptionIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  menuOptionTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  menuOptionSubtitle: { marginTop: 3, fontSize: 11, color: '#888' },
});
