import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const PINK = '#ed1761';
const PINK_DARK = '#d90d55';
const PINK_SOFT = '#fce7ef';
const TEXT = '#111111';
const MUTED = '#777777';

const VALID_CPF = '12345678900';
const VALID_PASSWORD = '123456';
const VALID_PIN = '1234';

function onlyNumbers(value) {
  return value.replace(/\D/g, '');
}

function formatCpf(value) {
  const digits = onlyNumbers(value).slice(0, 11);

  if (digits.length <= 3) return digits;

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(
      3,
      6
    )}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(
    3,
    6
  )}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function WalletLogo({
  size = 80,
  inverted = false,
}) {
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: inverted
            ? '#ffffff'
            : PINK,
        },
      ]}
    >
      <MaterialCommunityIcons
        name="wallet-outline"
        size={size * 0.48}
        color={inverted ? PINK : '#ffffff'}
      />
    </View>
  );
}

/* =========================
   SPLASH
========================= */

function AppSplash({ onFinish }) {
  const logoScale = useRef(
    new Animated.Value(0.7)
  ).current;

  const logoOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const textOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const translate = useRef(
    new Animated.Value(18)
  ).current;

  const screenOpacity = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),

        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),

        Animated.timing(translate, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(900),

      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.splash,
        {
          opacity: screenOpacity,
        },
      ]}
    >
      <StatusBar hidden />

      <View style={styles.splashCircle1} />
      <View style={styles.splashCircle2} />
      <View style={styles.splashCircle3} />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <WalletLogo
          size={126}
          inverted
        />
      </Animated.View>

      <Animated.View
        style={{
          alignItems: 'center',
          opacity: textOpacity,
          transform: [
            {
              translateY: translate,
            },
          ],
        }}
      >
        <Text style={styles.splashTitle}>
          carteira
        </Text>

        <Text style={styles.splashSubtitle}>
          simples, rápida e do seu jeito
        </Text>
      </Animated.View>

      <View style={styles.splashDots}>
        <View style={styles.splashDotActive} />
        <View style={styles.splashDot} />
        <View style={styles.splashDot} />
      </View>
    </Animated.View>
  );
}

/* =========================
   LOGIN
========================= */

function LoginScreen({ onSuccess }) {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState('');

  const shake = useRef(
    new Animated.Value(0)
  ).current;

  const entrance = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  function animateError() {
    Animated.sequence([
      Animated.timing(shake, {
        toValue: -7,
        duration: 60,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 7,
        duration: 70,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: -5,
        duration: 70,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 5,
        duration: 70,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function login() {
    const cpfDigits =
      onlyNumbers(cpf);

    if (!cpfDigits || !password) {
      setError(
        'Preencha o CPF e a senha.'
      );

      animateError();
      return;
    }

    if (
      cpfDigits !== VALID_CPF ||
      password !== VALID_PASSWORD
    ) {
      setError(
        'CPF ou senha incorretos.'
      );

      animateError();
      return;
    }

    setError('');
    onSuccess();
  }

  const translateY =
    entrance.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

  return (
    <SafeAreaView style={styles.whiteScreen}>
      <StatusBar hidden />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={
            styles.loginScroll
          }
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.loginContent,
              {
                opacity: entrance,
                transform: [
                  { translateY },
                  { translateX: shake },
                ],
              },
            ]}
          >
            <View style={styles.loginHeader}>
              <WalletLogo size={74} />

              <Text style={styles.loginTitle}>
                Bem-vindo
              </Text>

              <Text style={styles.loginSubtitle}>
                Entre para acessar sua carteira
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>
                CPF
              </Text>

              <View
                style={[
                  styles.inputBox,
                  error &&
                    styles.inputBoxError,
                ]}
              >
                <MaterialCommunityIcons
                  name="card-account-details-outline"
                  size={22}
                  color="#777"
                />

                <TextInput
                  value={cpf}
                  onChangeText={value => {
                    setCpf(formatCpf(value));
                    setError('');
                  }}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#aaa"
                  keyboardType="number-pad"
                  maxLength={14}
                  style={styles.input}
                />
              </View>

              <Text style={styles.label}>
                Senha
              </Text>

              <View
                style={[
                  styles.inputBox,
                  error &&
                    styles.inputBoxError,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#777"
                />

                <TextInput
                  value={password}
                  onChangeText={value => {
                    setPassword(value);
                    setError('');
                  }}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#aaa"
                  secureTextEntry={
                    !showPassword
                  }
                  style={styles.input}
                />

                <Pressable
                  hitSlop={12}
                  onPress={() =>
                    setShowPassword(
                      value => !value
                    )
                  }
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={22}
                    color="#777"
                  />
                </Pressable>
              </View>

              <View style={styles.errorArea}>
                {error ? (
                  <View style={styles.errorRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={17}
                      color="#d93025"
                    />

                    <Text
                      style={styles.errorText}
                    >
                      {error}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Pressable
                onPress={login}
                style={({ pressed }) => [
                  styles.loginButton,
                  pressed &&
                    styles.loginButtonPressed,
                ]}
              >
                <Text
                  style={
                    styles.loginButtonText
                  }
                >
                  Entrar
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color="#fff"
                />
              </Pressable>

              <Pressable>
                <Text
                  style={
                    styles.forgotPassword
                  }
                >
                  Esqueci minha senha
                </Text>
              </Pressable>
            </View>

            <View style={styles.securityInfo}>
              <Ionicons
                name="shield-checkmark-outline"
                size={19}
                color={PINK}
              />

              <Text
                style={styles.securityText}
              >
                Credenciais utilizadas apenas
                localmente neste aplicativo.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =========================
   PIN
========================= */

function PinScreen({
  name,
  onSuccess,
  onBack,
}) {
  const { width, height } =
    useWindowDimensions();

  const [pin, setPin] = useState('');
  const [error, setError] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const shake = useRef(
    new Animated.Value(0)
  ).current;

  const successScale = useRef(
    new Animated.Value(0)
  ).current;

  const compact = height < 700;

  const keySize = Math.min(
    82,
    Math.max(65, width * 0.19)
  );

  function wrongPin() {
    setError(true);

    Animated.sequence([
      Animated.timing(shake, {
        toValue: -9,
        duration: 55,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 9,
        duration: 65,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: -6,
        duration: 65,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 6,
        duration: 65,
        useNativeDriver: true,
      }),

      Animated.timing(shake, {
        toValue: 0,
        duration: 55,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setPin('');
      setError(false);
    }, 650);
  }

  function unlock() {
    setSuccess(true);

    Animated.spring(successScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onSuccess();
    }, 600);
  }

  function typeNumber(number) {
    if (
      pin.length >= 4 ||
      success
    ) {
      return;
    }

    const next = pin + number;

    setError(false);
    setPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        if (next === VALID_PIN) {
          unlock();
        } else {
          wrongPin();
        }
      }, 130);
    }
  }

  function erase() {
    if (success) return;

    setPin(value =>
      value.slice(0, -1)
    );

    setError(false);
  }

  return (
    <SafeAreaView style={styles.whiteScreen}>
      <StatusBar hidden />

      <View style={styles.pinScreen}>
        <View
          style={[
            styles.pinHeader,
            compact && {
              height: 75,
            },
          ]}
        >
          <Pressable
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color="#222"
            />
          </Pressable>

          <WalletLogo
            size={compact ? 52 : 62}
          />

          <View style={{ width: 44 }} />
        </View>

        <View
          style={[
            styles.pinTitleArea,
            compact && {
              marginTop: 0,
            },
          ]}
        >
          <Text style={styles.pinTitle}>
            Olá, {name}!
          </Text>

          <Text
            style={styles.pinSubtitle}
          >
            Digite sua senha para continuar
          </Text>
        </View>

        <Animated.View
          style={[
            styles.pinDots,
            compact && {
              marginTop: 22,
            },
            {
              transform: [
                {
                  translateX: shake,
                },
              ],
            },
          ]}
        >
          {[0, 1, 2, 3].map(index => {
            const filled =
              index < pin.length;

            return (
              <View
                key={index}
                style={[
                  styles.pinDot,
                  filled &&
                    styles.pinDotFilled,
                  error &&
                    styles.pinDotError,
                  success &&
                    styles.pinDotSuccess,
                ]}
              />
            );
          })}
        </Animated.View>

        <View
          style={styles.pinMessageArea}
        >
          {error ? (
            <Text
              style={styles.pinErrorText}
            >
              Senha incorreta
            </Text>
          ) : null}

          {success ? (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: successScale,
                  },
                ],
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={32}
                color="#22a06b"
              />
            </Animated.View>
          ) : null}
        </View>

        <View
          style={[
            styles.keypad,
            {
              width: Math.min(
                320,
                width - 45
              ),
            },
          ]}
        >
          {[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
          ].map(number => (
            <PinKey
              key={number}
              label={number}
              size={keySize}
              onPress={() =>
                typeNumber(number)
              }
            />
          ))}

          <PinKey
            size={keySize}
            onPress={() => {}}
            icon={
              <MaterialCommunityIcons
                name="fingerprint"
                size={36}
                color={PINK}
              />
            }
          />

          <PinKey
            label="0"
            size={keySize}
            onPress={() =>
              typeNumber('0')
            }
          />

          <PinKey
            size={keySize}
            onPress={erase}
            icon={
              <Ionicons
                name="backspace-outline"
                size={30}
                color={PINK}
              />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PinKey({
  label,
  icon,
  onPress,
  size,
}) {
  const scale = useRef(
    new Animated.Value(1)
  ).current;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        Animated.spring(scale, {
          toValue: 0.88,
          useNativeDriver: true,
        }).start();
      }}
      onPressOut={() => {
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }).start();
      }}
    >
      <Animated.View
        style={[
          styles.key,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale }],
          },
        ]}
      >
        {icon || (
          <Text style={styles.keyText}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

/* =========================
   HOME
========================= */

function HomeScreen({
  name,
  onLock,
  onLogout,
}) {
  const [showBalance, setShowBalance] =
    useState(true);

  const [menu, setMenu] =
    useState(false);

  return (
    <SafeAreaView style={styles.homeSafe}>
      <StatusBar hidden />

      <View style={styles.homeRoot}>
        <View style={styles.homeHeader}>
          <View style={styles.homeTop}>
            <Pressable
              style={styles.avatar}
              onPress={() => setMenu(true)}
            >
              <Feather
                name="user"
                size={27}
                color="#fff"
              />
            </Pressable>

            <View
              style={styles.headerActions}
            >
              <Pressable
                style={styles.headerIcon}
                onPress={() =>
                  setShowBalance(
                    value => !value
                  )
                }
              >
                <Ionicons
                  name={
                    showBalance
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={25}
                  color="#fff"
                />
              </Pressable>

              <Pressable
                style={styles.headerIcon}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={25}
                  color="#fff"
                />
              </Pressable>

              <Pressable
                style={styles.headerIcon}
              >
                <Ionicons
                  name="person-add-outline"
                  size={25}
                  color="#fff"
                />
              </Pressable>
            </View>
          </View>

          <Text style={styles.greeting}>
            Olá, {name}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 105,
          }}
        >
          <View
            style={styles.accountSection}
          >
            <View
              style={
                styles.accountTitleRow
              }
            >
              <Text
                style={styles.accountTitle}
              >
                Conta
              </Text>

              <Ionicons
                name="chevron-forward"
                size={23}
                color="#222"
              />
            </View>

            <Text style={styles.balance}>
              {showBalance
                ? 'R$ 4.280,75'
                : '••••'}
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.shortcuts
            }
          >
            <Shortcut
              icon="qrcode-scan"
              title="Área Pix"
            />

            <Shortcut
              icon="barcode"
              title="Pagar"
            />

            <Shortcut
              icon="hand-coin-outline"
              title={'Pegar\nemprestado'}
            />

            <Shortcut
              icon="bank-transfer-out"
              title="Transferir"
            />

            <Shortcut
              icon="cellphone"
              title="Recarga"
            />
          </ScrollView>

          <Pressable
            style={styles.cardsButton}
          >
            <MaterialCommunityIcons
              name="credit-card-outline"
              size={25}
              color={TEXT}
            />

            <Text
              style={
                styles.cardsButtonText
              }
            >
              Meus cartões
            </Text>
          </Pressable>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.infoCards
            }
          >
            <View style={styles.infoCard}>
              <Text
                style={styles.infoText}
              >
                Você tem até{' '}
                <Text
                  style={styles.pinkText}
                >
                  {showBalance
                    ? 'R$ 1.498,26'
                    : '••••'}
                </Text>{' '}
                disponíveis.
              </Text>

              <Text
                style={styles.infoAction}
              >
                Saiba mais
              </Text>
            </View>

            <View style={styles.infoCard}>
              <Text
                style={styles.infoText}
              >
                Organize seus gastos e
                acompanhe tudo em um só
                lugar.
              </Text>

              <Text
                style={styles.infoAction}
              >
                Conferir
              </Text>
            </View>
          </ScrollView>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Cartão
            </Text>

            <View
              style={styles.creditRow}
            >
              <View>
                <Text
                  style={
                    styles.creditLabel
                  }
                >
                  Limite disponível
                </Text>

                <Text
                  style={
                    styles.creditValue
                  }
                >
                  {showBalance
                    ? 'R$ 2.650,00'
                    : '••••'}
                </Text>
              </View>

              <View
                style={styles.cardIcon}
              >
                <MaterialCommunityIcons
                  name="credit-card-chip-outline"
                  size={28}
                  color={PINK}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <View
            style={[
              styles.bottomButton,
              styles.bottomActive,
            ]}
          >
            <Ionicons
              name="swap-horizontal"
              size={25}
              color={PINK}
            />
          </View>

          <View
            style={styles.bottomButton}
          >
            <Ionicons
              name="cash-outline"
              size={25}
              color="#777"
            />
          </View>

          <View
            style={styles.bottomButton}
          >
            <Ionicons
              name="bag-outline"
              size={25}
              color="#777"
            />
          </View>
        </View>
      </View>

      <AccountMenu
        visible={menu}
        onClose={() => setMenu(false)}
        onLock={() => {
          setMenu(false);
          onLock();
        }}
        onLogout={() => {
          setMenu(false);
          onLogout();
        }}
      />
    </SafeAreaView>
  );
}

function Shortcut({
  icon,
  title,
}) {
  return (
    <Pressable style={styles.shortcut}>
      <View
        style={styles.shortcutCircle}
      >
        <MaterialCommunityIcons
          name={icon}
          size={27}
          color="#111"
        />
      </View>

      <Text
        style={styles.shortcutText}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* =========================
   MENU
========================= */

function AccountMenu({
  visible,
  onClose,
  onLock,
  onLogout,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.modalBackdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.menuSheet}
          onPress={() => {}}
        >
          <View style={styles.menuHandle} />

          <Text style={styles.menuTitle}>
            Minha carteira
          </Text>

          <MenuOption
            icon="lock-closed-outline"
            title="Bloquear"
            subtitle="Solicitar a senha de desbloqueio"
            onPress={onLock}
          />

          <MenuOption
            icon="log-out-outline"
            title="Sair"
            subtitle="Voltar para a tela de acesso"
            onPress={onLogout}
          />

          <View style={styles.menuFooter}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#aaa"
            />

            <Text
              style={styles.menuFooterText}
            >
              Ambiente fictício • sem conexão
              bancária
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function MenuOption({
  icon,
  title,
  subtitle,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.menuOption}
    >
      <View
        style={styles.menuOptionIcon}
      >
        <Ionicons
          name={icon}
          size={22}
          color={PINK}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={styles.menuOptionTitle}
        >
          {title}
        </Text>

        <Text
          style={
            styles.menuOptionSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#aaa"
      />
    </Pressable>
  );
}

/* =========================
   APP
========================= */

export default function App() {
  const [screen, setScreen] =
    useState('splash');

  const name = 'Franciele';

  if (screen === 'splash') {
    return (
      <AppSplash
        onFinish={() =>
          setScreen('login')
        }
      />
    );
  }

  if (screen === 'login') {
    return (
      <LoginScreen
        onSuccess={() =>
          setScreen('pin')
        }
      />
    );
  }

  if (screen === 'pin') {
    return (
      <PinScreen
        name={name}
        onSuccess={() =>
          setScreen('home')
        }
        onBack={() =>
          setScreen('login')
        }
      />
    );
  }

  return (
    <HomeScreen
      name={name}
      onLock={() =>
        setScreen('pin')
      }
      onLogout={() =>
        setScreen('login')
      }
    />
  );
}

/* =========================
   ESTILOS
========================= */

const styles = StyleSheet.create({
  whiteScreen: {
    flex: 1,
    backgroundColor: '#fff',
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  splash: {
    flex: 1,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  splashCircle1: {
    position: 'absolute',
    width: 330,
    height: 330,
    borderRadius: 165,
    backgroundColor:
      'rgba(255,255,255,0.05)',
    right: -140,
    top: -100,
  },

  splashCircle2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor:
      'rgba(255,255,255,0.04)',
    left: -100,
    bottom: -55,
  },

  splashCircle3: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 16,
    borderColor:
      'rgba(255,255,255,0.035)',
    right: 35,
    bottom: 130,
  },

  splashTitle: {
    marginTop: 24,
    color: '#fff',
    fontSize: 52,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -2,
  },

  splashSubtitle: {
    marginTop: 7,
    fontSize: 15,
    color:
      'rgba(255,255,255,0.9)',
  },

  splashDots: {
    position: 'absolute',
    bottom: 45,
    flexDirection: 'row',
    gap: 12,
  },

  splashDotActive: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  splashDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor:
      'rgba(255,255,255,.3)',
  },

  loginScroll: {
    flexGrow: 1,
  },

  loginContent: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 45,
    paddingBottom: 25,
  },

  loginHeader: {
    alignItems: 'center',
  },

  loginTitle: {
    marginTop: 21,
    fontSize: 29,
    fontWeight: '800',
    color: TEXT,
  },

  loginSubtitle: {
    marginTop: 6,
    color: MUTED,
    fontSize: 14,
  },

  form: {
    marginTop: 42,
  },

  label: {
    marginLeft: 3,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },

  inputBox: {
    height: 59,
    borderRadius: 17,
    borderWidth: 1.2,
    borderColor: '#e2e2e2',
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  inputBoxError: {
    borderColor: '#e3a19c',
  },

  input: {
    flex: 1,
    height: '100%',
    marginLeft: 11,
    fontSize: 16,
    color: TEXT,
  },

  errorArea: {
    minHeight: 28,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  errorText: {
    color: '#d93025',
    fontSize: 13,
  },

  loginButton: {
    height: 59,
    borderRadius: 30,
    backgroundColor: PINK,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  loginButtonPressed: {
    backgroundColor: PINK_DARK,
    transform: [{ scale: 0.985 }],
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },

  forgotPassword: {
    marginTop: 23,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: PINK,
  },

  securityInfo: {
    marginTop: 'auto',
    paddingTop: 34,
    alignSelf: 'center',
    maxWidth: 300,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  securityText: {
    flex: 1,
    color: '#999',
    fontSize: 11,
    lineHeight: 16,
  },

  pinScreen: {
    flex: 1,
    paddingHorizontal: 22,
  },

  pinHeader: {
    height: 96,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinTitleArea: {
    alignItems: 'center',
    marginTop: 5,
  },

  pinTitle: {
    color: TEXT,
    fontSize: 27,
    fontWeight: '800',
  },

  pinSubtitle: {
    marginTop: 7,
    color: MUTED,
    fontSize: 14,
  },

  pinDots: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 27,
  },

  pinDot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: PINK,
  },

  pinDotFilled: {
    backgroundColor: PINK,
  },

  pinDotError: {
    borderColor: '#d93025',
    backgroundColor: '#d93025',
  },

  pinDotSuccess: {
    borderColor: '#22a06b',
    backgroundColor: '#22a06b',
  },

  pinMessageArea: {
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pinErrorText: {
    color: '#d93025',
    fontSize: 13,
    fontWeight: '600',
  },

  keypad: {
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between',
    rowGap: 15,
  },

  key: {
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  keyText: {
    fontSize: 30,
    fontWeight: '500',
    color: TEXT,
  },

  homeSafe: {
    flex: 1,
    backgroundColor: PINK,
  },

  homeRoot: {
    flex: 1,
    backgroundColor: '#fff',
  },

  homeHeader: {
    backgroundColor: PINK,
    paddingHorizontal: 23,
    paddingTop: 17,
    paddingBottom: 26,
  },

  homeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: PINK_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 3,
  },

  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },

  greeting: {
    marginTop: 26,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  accountSection: {
    paddingHorizontal: 23,
    paddingTop: 26,
    paddingBottom: 23,
  },

  accountTitleRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
  },

  accountTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: TEXT,
  },

  balance: {
    marginTop: 11,
    fontSize: 20,
    fontWeight: '700',
    color: TEXT,
  },

  shortcuts: {
    paddingHorizontal: 16,
    gap: 8,
  },

  shortcut: {
    width: 85,
    alignItems: 'center',
  },

  shortcutCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  shortcutText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    color: '#222',
  },

  cardsButton: {
    marginHorizontal: 22,
    marginTop: 27,
    height: 64,
    borderRadius: 17,
    backgroundColor: PINK_SOFT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
    gap: 14,
  },

  cardsButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT,
  },

  infoCards: {
    paddingHorizontal: 22,
    paddingTop: 20,
    gap: 14,
  },

  infoCard: {
    width: 265,
    minHeight: 142,
    borderRadius: 18,
    backgroundColor: PINK_SOFT,
    padding: 19,
  },

  infoText: {
    fontSize: 16,
    lineHeight: 23,
    color: TEXT,
  },

  pinkText: {
    color: PINK,
    fontWeight: '700',
  },

  infoAction: {
    marginTop: 'auto',
    paddingTop: 14,
    color: PINK,
    fontSize: 14,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 28,
  },

  section: {
    padding: 23,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: TEXT,
  },

  creditRow: {
    marginTop: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  creditLabel: {
    color: '#777',
    fontSize: 13,
  },

  creditValue: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: '700',
    color: TEXT,
  },

  cardIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 16,
    left: 63,
    right: 63,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent:
      'space-around',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 9,
  },

  bottomButton: {
    width: 47,
    height: 47,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomActive: {
    backgroundColor: PINK_SOFT,
  },

  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor:
      'rgba(0,0,0,.34)',
  },

  menuSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 11,
    paddingBottom: 27,
  },

  menuHandle: {
    width: 42,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#ddd',
    alignSelf: 'center',
  },

  menuTitle: {
    marginTop: 22,
    marginBottom: 14,
    fontSize: 21,
    fontWeight: '800',
    color: TEXT,
  },

  menuOption: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },

  menuOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PINK_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuOptionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT,
  },

  menuOptionSubtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#888',
  },

  menuFooter: {
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  menuFooterText: {
    color: '#aaa',
    fontSize: 10,
  },
});
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
