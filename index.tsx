import styled from "styled-components/native";
import Title from "../components/Titulo/titulo";
import { useEffect, useState } from "react";
import InputTexto from "@/components/Input/input";
import Entypo from '@expo/vector-icons/Entypo';
import { Platform, Pressable, View, Alert } from "react-native";
import { api } from "@/utils/api";
import { useRouter } from "expo-router";

type ContainerInput = View & {
    error: boolean
}

export default function App() {
    const [email, setEmail] = useState('exemplo@exemplo.com')
    const [erroEmail, setErroEmail] = useState(false)

    const [senha, setSenha] = useState('!Pass123')
    const [erroSenha, setErroSenha] = useState(false)

    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erroConfirmarSenha, setErroConfirmarSenha] = useState(false)

    const [senhaVisivel, setSenhaVisivel] = useState(true)

    const [invalidLogin, setInvalidLogin] = useState(false)
    const [formularioValido, setFormularioValido] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === 'exemplo@exemplo.com') {
            setFormularioValido(true)
        } else if (emailRegex.test(email)) {
            setErroEmail(false)
            setFormularioValido(false)
        } else {
            setErroEmail(true)
            setFormularioValido(true)
        }
    }, [email])

    useEffect(() => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (senha === '!Pass123') {
            setFormularioValido(true)
        } else if (passwordRegex.test(senha)) {
            setErroSenha(false)
            setFormularioValido(false)
        } else {
            setErroSenha(true)
            setFormularioValido(true)
        }
    }, [senha])

    useEffect(() => {
        if (confirmarSenha && confirmarSenha !== senha) {
            setErroConfirmarSenha(true)
            setFormularioValido(true)
        } else {
            setErroConfirmarSenha(false)
            setFormularioValido(false)
        }
    }, [confirmarSenha, senha])

    async function Logar() {
        try {
            const resposta = await api.post('/Cadastrar', {
                email: email,
                senha: senha
            })
            if (resposta.status === 201) {
                Alert.alert("Sucesso ao cadastrar")
            }

        } catch (error: any) {
            if (error) {
                if (error.status === 409) {
                    alert("este usuario já esta cadastrado!");
                }else if (error.status === 500){
                    alert('erro inesperado no servidor. Tente novamente mais tarde!');
                } else {
                    alert (`erro ao cadastrar: ${error.status}`);
                }
                } else {
                    alert("erro de conexão. Verifique sua internet")
                }

                }
            }
    return (
        <Tela>
            <Title texto={"Criar conta"} flag={true} />

            <ContainerCampoTexto>
                <View>
                    <ContainerTextInput error={erroEmail}>
                        <InputTexto

                            placeholder="Digite seu email..."
                            onChangeText={text => setEmail(text)}
                        />
                    </ContainerTextInput>
                    {erroEmail && <TextErrorHint>Email inválido</TextErrorHint>}
                </View>

                <View>
                    <ContainerTextInput error={erroSenha}>
                        <InputTexto
                            placeholder="Digite sua senha..."
                            onChangeText={text => setSenha(text)}
                            secureTextEntry={senhaVisivel}
                        />
                        <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
                            <StyledIcon name={senhaVisivel ? "eye" : "eye-with-line"} size={24} color="black" />
                        </Pressable>
                    </ContainerTextInput>
                    {erroSenha && <TextErrorHint>Senha inválida</TextErrorHint>}
                </View>

                <View>
                    <ContainerTextInput error={erroConfirmarSenha}>
                        <InputTexto
                            placeholder="Confirme sua senha..."
                            onChangeText={text => setConfirmarSenha(text)}
                            secureTextEntry={senhaVisivel}
                        />
                        <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
                            <StyledIcon name={senhaVisivel ? "eye" : "eye-with-line"} size={24} color="black" />
                        </Pressable>
                    </ContainerTextInput>
                    {erroConfirmarSenha && <TextErrorHint>As senhas não coincidem</TextErrorHint>}
                </View>
            </ContainerCampoTexto>

            {invalidLogin && <TextErrorHint>Usuário ou senha incorretos!</TextErrorHint>}

            <ContainerBotoes>
                <Botao
                    disabled={formularioValido}
                    onPress={Logar}
                >
                    <TextoBotao> Criar Conta</TextoBotao>
                </Botao>

            </ContainerBotoes>
        </Tela>
    )
}

const Tela = styled.View`
    flex: 1;
    background-color: #858688;
    padding: 26px;
`

const ContainerCampoTexto = styled.View`
    gap: 25px;
`

const ContainerBotoes = styled.View`
    margin-top: 65px;
    gap: 20px;
`

const ContainerTextInput = styled.View<ContainerInput>`
    width: 100%;
    height: 80px;
    flex-direction: row;
    align-items: center;
    border: 3px solid ${({ error }: { error: boolean }) =>
        error ? '#E63946' : '#2193F3'};
    border-radius: 6px;
    background-color: #fff;
`

const StyledIcon = styled(Entypo)`
    margin-right: 20px;
`

const Botao = styled.Pressable`
    background-color: #1872d9;
    padding: 20px;
    border-radius: 6px;
`

const TextoBotao = styled.Text`
    text-align: center;
    font-size: 24px;
    color: #fff;
`

const Links = styled.Text`
    text-align: center;
    color: #fff;
    font-size: 16px;
`

const TextErrorHint = styled.Text`
    font-size: 16px;
    color: #E63946;
`
