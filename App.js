import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const PINK = '#ED1761';
const PINK_DARK = '#D90D55';
const PINK_SOFT = '#FCE7EF';
const BG = '#FFFFFF';
const TEXT = '#121212';
const MUTED = '#777777';
const GREEN = '#239A5F';

const VALID_CPF = '12345678900';
const VALID_PASSWORD = '123456';
const VALID_PIN = '1234';
const USER_NAME = 'Franciele';

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatCpf(value) {
  const d = onlyNumbers(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function BrandMark({ size = 80, inverse = false }) {
  const bg = inverse ? '#FFFFFF' : PINK;
  const fg = inverse ? PINK : '#FFFFFF';
  return (
    <View style={[styles.brandMark, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
      <View style={[styles.brandLoop, { width: size * 0.48, height: size * 0.48, borderColor: fg, borderRadius: size * 0.18 }]} />
      <View style={[styles.brandLoop, styles.brandLoopShift, { width: size * 0.48, height: size * 0.48, borderColor: fg, borderRadius: size * 0.18 }]} />
    </View>
  );
}

function Splash({ onFinish }) {
  const scale = useRef(new Animated.Value(0.78)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(16)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.delay(900),
      Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onFinish);
  }, []);

  return (
    <Animated.View style={[styles.splash, { opacity: fade }]}>
      <StatusBar hidden />
      <View style={styles.splashOrbA} />
      <View style={styles.splashOrbB} />
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <BrandMark size={128} inverse />
      </Animated.View>
      <Animated.View style={{ opacity, transform: [{ translateY: textY }], alignItems: 'center' }}>
        <Text style={styles.splashName}>carteira</Text>
        <Text style={styles.splashTag}>Sua vida financeira, mais simples.</Text>
      </Animated.View>
      <View style={styles.splashDots}>
        <View style={styles.dotStrong} />
        <View style={styles.dotWeak} />
        <View style={styles.dotWeak} />
      </View>
    </Animated.View>
  );
}

function Login({ onSuccess }) {
  const { height } = useWindowDimensions();
  const compact = height < 720;
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const shake = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, []);

  const fail = message => {
    setError(message);
    Animated.sequence([
      Animated.timing(shake, { toValue: -7, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 7, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -5, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 5, duration: 65, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  };

  const submit = () => {
    if (!cpf || !password) return fail('Preencha CPF e senha.');
    if (onlyNumbers(cpf) !== VALID_CPF || password !== VALID_PASSWORD) return fail('CPF ou senha incorretos.');
    setError('');
    onSuccess();
  };

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.loginScroll, compact && styles.loginScrollCompact]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              width: '100%',
              maxWidth: 430,
              alignSelf: 'center',
              opacity: enter,
              transform: [
                { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
                { translateX: shake },
              ],
            }}
          >
            <View style={styles.loginHero}>
              <BrandMark size={compact ? 62 : 72} />
              <Text style={[styles.loginTitle, compact && { marginTop: 16 }]}>Bem-vindo</Text>
              <Text style={styles.loginSubtitle}>Entre para acessar sua carteira</Text>
            </View>

            <View style={[styles.form, compact && { marginTop: 28 }]}>
              <Text style={styles.label}>CPF</Text>
              <View style={[styles.inputWrap, error && styles.inputError]}>
                <MaterialCommunityIcons name="card-account-details-outline" size={21} color="#777" />
                <TextInput
                  value={cpf}
                  onChangeText={v => { setCpf(formatCpf(v)); setError(''); }}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#A7A7A7"
                  keyboardType="number-pad"
                  maxLength={14}
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>Senha</Text>
              <View style={[styles.inputWrap, error && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color="#777" />
                <TextInput
                  value={password}
                  onChangeText={v => { setPassword(v); setError(''); }}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#A7A7A7"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  onSubmitEditing={submit}
                />
                <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={10}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={21} color="#777" />
                </Pressable>
              </View>

              <View style={styles.errorSpace}>
                {!!error && <Text style={styles.errorText}>{error}</Text>}
              </View>

              <Pressable onPress={submit} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
                <Text style={styles.primaryButtonText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </Pressable>

              <Pressable onPress={() => Alert.alert('Recuperação', 'Nesta versão local, use as credenciais de teste definidas no projeto.')}>
                <Text style={styles.linkText}>Esqueci minha senha</Text>
              </Pressable>
            </View>

            <View style={styles.localNote}>
              <Ionicons name="shield-checkmark-outline" size={18} color={PINK} />
              <Text style={styles.localNoteText}>Acesso local, sem conexão com instituição financeira.</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Key({ label, icon, onPress, size }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }).start()}
    >
      <Animated.View style={[styles.key, { width: size, height: size, borderRadius: size / 2, transform: [{ scale }] }]}>
        {icon || <Text style={[styles.keyText, { fontSize: size * 0.36 }]}>{label}</Text>}
      </Animated.View>
    </Pressable>
  );
}

function Pin({ onSuccess, onLogout }) {
  const { width, height } = useWindowDimensions();
  const keySize = Math.max(62, Math.min(82, width * 0.205, height * 0.102));
  const keypadWidth = Math.min(width - 48, keySize * 3 + 44);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const shake = useRef(new Animated.Value(0)).current;

  const wrong = () => {
    setError(true);
    Animated.sequence([
      Animated.timing(shake, { toValue: -9, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 9, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
    setTimeout(() => { setPin(''); setError(false); }, 650);
  };

  const pressDigit = digit => {
    if (pin.length >= 4 || success) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === VALID_PIN) {
          setSuccess(true);
          setTimeout(onSuccess, 420);
        } else wrong();
      }, 120);
    }
  };

  return (
    <View style={styles.pinScreen}>
      <StatusBar hidden />
      <View style={styles.pinHeader}>
        <Pressable onPress={onLogout} style={styles.roundPlain}><Ionicons name="chevron-back" size={26} color={TEXT} /></Pressable>
        <BrandMark size={56} />
        <View style={styles.roundPlain} />
      </View>

      <View style={styles.pinIntro}>
        <Text style={styles.pinHello}>Olá, {USER_NAME}!</Text>
        <Text style={styles.pinSub}>Digite sua senha para continuar</Text>
      </View>

      <Animated.View style={[styles.pinDots, { transform: [{ translateX: shake }] }]}>
        {[0, 1, 2, 3].map(i => <View key={i} style={[styles.pinDot, i < pin.length && styles.pinDotOn, error && styles.pinDotBad, success && styles.pinDotGood]} />)}
      </Animated.View>
      <View style={styles.pinFeedback}>
        {error && <Text style={styles.errorText}>Senha incorreta. Tente novamente.</Text>}
        {success && <Ionicons name="checkmark-circle" size={30} color={GREEN} />}
      </View>

      <View style={[styles.keypad, { width: keypadWidth }]}>
        {['1','2','3','4','5','6','7','8','9'].map(n => <Key key={n} label={n} size={keySize} onPress={() => pressDigit(n)} />)}
        <Key size={keySize} onPress={() => Alert.alert('Biometria', 'Biometria não configurada nesta versão local.')} icon={<MaterialCommunityIcons name="fingerprint" size={keySize * 0.47} color={PINK} />} />
        <Key label="0" size={keySize} onPress={() => pressDigit('0')} />
        <Key size={keySize} onPress={() => setPin(v => v.slice(0, -1))} icon={<Ionicons name="backspace-outline" size={keySize * 0.38} color={PINK} />} />
      </View>

      <Pressable style={styles.pinForgot} onPress={() => Alert.alert('Senha de acesso', 'Use o PIN de teste definido no código do projeto.')}>
        <Text style={styles.linkText}>Esqueci minha senha</Text>
      </Pressable>
    </View>
  );
}

function Shortcut({ icon, label }) {
  return (
    <Pressable style={({ pressed }) => [styles.shortcut, pressed && { opacity: 0.65 }]} onPress={() => Alert.alert(label, 'Ação visual desta carteira local.')}>
      <View style={styles.shortcutCircle}><MaterialCommunityIcons name={icon} size={27} color={TEXT} /></View>
      <Text style={styles.shortcutText}>{label}</Text>
    </Pressable>
  );
}

function Home({ onLock, onLogout }) {
  const [showBalance, setShowBalance] = useState(true);
  const balance = showBalance ? 'R$ 4.280,75' : '••••';
  const loan = showBalance ? 'R$ 1.498,26' : '••••';

  return (
    <View style={styles.home}>
      <StatusBar hidden />
      <View style={styles.homeHeader}>
        <View style={styles.homeTop}>
          <Pressable style={styles.avatar} onPress={() => Alert.alert('Conta', 'Carteira local fictícia.', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Bloquear', onPress: onLock },
            { text: 'Sair', onPress: onLogout },
          ])}>
            <Feather name="user" size={26} color="#FFF" />
            <View style={styles.avatarBadge}><Ionicons name="chevron-down" size={10} color={PINK} /></View>
          </Pressable>
          <View style={styles.headerIcons}>
            <Pressable style={styles.headerIcon} onPress={() => setShowBalance(v => !v)}><Ionicons name={showBalance ? 'eye-outline' : 'eye-off-outline'} size={25} color="#FFF" /></Pressable>
            <Pressable style={styles.headerIcon} onPress={() => Alert.alert('Ajuda', 'Central de ajuda local.')}><Ionicons name="help-circle-outline" size={25} color="#FFF" /></Pressable>
            <Pressable style={styles.headerIcon} onPress={() => Alert.alert('Perfil', 'Opção visual nesta versão.')}><Ionicons name="person-add-outline" size={24} color="#FFF" /></Pressable>
          </View>
        </View>
        <Text style={styles.greeting}>Olá, {USER_NAME}</Text>
      </View>

      <ScrollView style={styles.homeBody} showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContent}>
        <View style={styles.accountBlock}>
          <View style={styles.rowBetween}><Text style={styles.accountTitle}>Conta</Text><Ionicons name="chevron-forward" size={22} color={TEXT} /></View>
          <Text style={styles.balance}>{balance}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutRow}>
          <Shortcut icon="shape-outline" label="Área Pix" />
          <Shortcut icon="barcode" label="Pagar" />
          <Shortcut icon="hand-coin-outline" label={'Pegar\nemprestado'} />
          <Shortcut icon="bank-transfer-out" label="Transferir" />
          <Shortcut icon="cellphone" label="Recarga" />
        </ScrollView>

        <Pressable style={styles.cardButton} onPress={() => Alert.alert('Meus cartões', 'Cartões fictícios desta carteira local.')}>
          <MaterialCommunityIcons name="credit-card-outline" size={25} color={TEXT} />
          <Text style={styles.cardButtonText}>Meus cartões</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Você tem até <Text style={styles.pink}>{loan}</Text> disponíveis para empréstimo.</Text>
            <Text style={styles.infoLink}>Saiba mais</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>Organize seus gastos e acompanhe tudo em um só lugar.</Text>
            <Text style={styles.infoLink}>Conferir</Text>
          </View>
        </ScrollView>

        <View style={styles.sectionDivider} />
        <View style={styles.section}>
          <Text style={styles.accountTitle}>Cartão</Text>
          <View style={[styles.rowBetween, { marginTop: 18 }]}>
            <View>
              <Text style={styles.mutedSmall}>Limite disponível</Text>
              <Text style={styles.cardLimit}>{showBalance ? 'R$ 2.650,00' : '••••'}</Text>
            </View>
            <View style={styles.miniCircle}><MaterialCommunityIcons name="credit-card-chip-outline" size={28} color={PINK} /></View>
          </View>
        </View>

        <Text style={styles.fictionFooter}>Carteira fictícia • sem conexão bancária</Text>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={[styles.navItem, styles.navActive]}><Ionicons name="swap-horizontal" size={25} color={PINK} /></View>
        <View style={styles.navItem}><Ionicons name="cash-outline" size={25} color="#777" /></View>
        <View style={styles.navItem}><Ionicons name="bag-outline" size={25} color="#777" /></View>
      </View>
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('splash');

  useEffect(() => {
    RNStatusBar.setHidden(true, 'none');
  }, []);

  const view = useMemo(() => {
    if (screen === 'splash') return <Splash onFinish={() => setScreen('login')} />;
    if (screen === 'login') return <Login onSuccess={() => setScreen('pin')} />;
    if (screen === 'pin') return <Pin onSuccess={() => setScreen('home')} onLogout={() => setScreen('login')} />;
    return <Home onLock={() => setScreen('pin')} onLogout={() => setScreen('login')} />;
  }, [screen]);

  return <View style={{ flex: 1, backgroundColor: BG }}>{view}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BG },
  brandMark: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brandLoop: { position: 'absolute', borderWidth: 4, transform: [{ rotate: '45deg' }] },
  brandLoopShift: { transform: [{ rotate: '-45deg' }], opacity: 0.95 },

  splash: { flex: 1, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  splashOrbA: { position: 'absolute', width: 330, height: 330, borderRadius: 165, backgroundColor: 'rgba(255,255,255,0.045)', right: -145, top: -95 },
  splashOrbB: { position: 'absolute', width: 270, height: 270, borderRadius: 135, backgroundColor: 'rgba(255,255,255,0.045)', left: -120, bottom: -50 },
  splashName: { color: '#FFF', fontSize: 54, lineHeight: 60, fontWeight: '900', letterSpacing: -2.3, marginTop: 22 },
  splashTag: { color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 7 },
  splashDots: { position: 'absolute', bottom: 38, flexDirection: 'row', gap: 11 },
  dotStrong: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#FFF' },
  dotWeak: { width: 9, height: 9, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' },

  loginScroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 28 },
  loginScrollCompact: { justifyContent: 'flex-start', paddingTop: 26, paddingBottom: 18 },
  loginHero: { alignItems: 'center' },
  loginTitle: { fontSize: 29, fontWeight: '800', color: TEXT, marginTop: 20 },
  loginSubtitle: { fontSize: 14, color: MUTED, marginTop: 6 },
  form: { marginTop: 38 },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginLeft: 3, marginBottom: 7 },
  inputWrap: { height: 58, borderRadius: 17, borderWidth: 1.2, borderColor: '#E2E2E2', backgroundColor: '#FAFAFA', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 17 },
  inputError: { borderColor: '#E5A6A1' },
  input: { flex: 1, height: '100%', marginLeft: 10, fontSize: 16, color: TEXT },
  errorSpace: { minHeight: 26, justifyContent: 'center' },
  errorText: { color: '#D93025', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  primaryButton: { height: 58, borderRadius: 29, backgroundColor: PINK, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  primaryButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.84, transform: [{ scale: 0.985 }] },
  linkText: { color: PINK, fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: 21 },
  localNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 30 },
  localNoteText: { color: '#9A9A9A', fontSize: 10.5 },

  pinScreen: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 24, paddingBottom: 16 },
  pinHeader: { height: 82, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roundPlain: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  pinIntro: { alignItems: 'center', marginTop: 2 },
  pinHello: { fontSize: 27, fontWeight: '800', color: TEXT },
  pinSub: { fontSize: 14, color: MUTED, marginTop: 6 },
  pinDots: { flexDirection: 'row', justifyContent: 'center', gap: 25, marginTop: 28 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: PINK, backgroundColor: '#FFF' },
  pinDotOn: { backgroundColor: PINK },
  pinDotBad: { borderColor: '#D93025', backgroundColor: '#D93025' },
  pinDotGood: { borderColor: GREEN, backgroundColor: GREEN },
  pinFeedback: { height: 40, alignItems: 'center', justifyContent: 'center' },
  keypad: { alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 13, marginTop: 2 },
  key: { backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  keyText: { color: TEXT, fontWeight: '500' },
  pinForgot: { marginTop: 'auto', paddingVertical: 8 },

  home: { flex: 1, backgroundColor: '#FFF' },
  homeHeader: { backgroundColor: PINK, paddingHorizontal: 23, paddingTop: 18, paddingBottom: 25 },
  homeTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: PINK_DARK, alignItems: 'center', justifyContent: 'center' },
  avatarBadge: { position: 'absolute', right: -1, top: -1, width: 17, height: 17, borderRadius: 9, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  headerIcons: { marginLeft: 'auto', flexDirection: 'row' },
  headerIcon: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  greeting: { marginTop: 23, color: '#FFF', fontSize: 20, fontWeight: '700' },
  homeBody: { flex: 1 },
  homeContent: { paddingBottom: 100 },
  accountBlock: { paddingHorizontal: 23, paddingTop: 24, paddingBottom: 20 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  accountTitle: { fontSize: 20, fontWeight: '800', color: TEXT },
  balance: { marginTop: 10, fontSize: 20, fontWeight: '700', color: TEXT },
  shortcutRow: { paddingHorizontal: 14, gap: 7, paddingBottom: 5 },
  shortcut: { width: 84, alignItems: 'center' },
  shortcutCircle: { width: 66, height: 66, borderRadius: 33, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  shortcutText: { marginTop: 8, textAlign: 'center', fontSize: 12, lineHeight: 15, color: TEXT },
  cardButton: { marginHorizontal: 22, marginTop: 24, height: 62, borderRadius: 17, backgroundColor: PINK_SOFT, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 13 },
  cardButtonText: { fontSize: 16, fontWeight: '700', color: TEXT },
  infoRow: { paddingHorizontal: 22, paddingTop: 18, gap: 13 },
  infoCard: { width: 265, minHeight: 138, backgroundColor: PINK_SOFT, borderRadius: 18, padding: 18 },
  infoText: { fontSize: 16, lineHeight: 22, color: TEXT },
  pink: { color: PINK, fontWeight: '700' },
  infoLink: { color: PINK, fontSize: 13, fontWeight: '700', marginTop: 'auto', paddingTop: 12 },
  sectionDivider: { height: 1, backgroundColor: '#EEEEEE', marginTop: 25 },
  section: { padding: 23 },
  mutedSmall: { fontSize: 12, color: MUTED },
  cardLimit: { fontSize: 18, fontWeight: '700', color: TEXT, marginTop: 5 },
  miniCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: PINK_SOFT, alignItems: 'center', justifyContent: 'center' },
  fictionFooter: { textAlign: 'center', color: '#B0B0B0', fontSize: 9.5, marginTop: 4 },
  bottomNav: { position: 'absolute', left: '17%', right: '17%', bottom: 12, height: 62, borderRadius: 31, backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', elevation: 10, shadowColor: '#000', shadowOpacity: 0.13, shadowRadius: 15, shadowOffset: { width: 0, height: 5 } },
  navItem: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  navActive: { backgroundColor: PINK_SOFT },
});
