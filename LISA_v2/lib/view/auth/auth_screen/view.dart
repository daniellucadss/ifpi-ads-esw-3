import 'package:flutter/material.dart';
import 'package:trabalho_loc_ai/_comum/meu_snackbar.dart';
import 'package:trabalho_loc_ai/view/auth/services/autenticacao_servico.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginState();
}

class _LoginState extends State<LoginPage> {
  bool queroEntrar = true;
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final AutenticacaoServico _autenticacaoServico = AutenticacaoServico();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Center(
          child: Card(
            elevation: 8,
            child: Container(
              padding: const EdgeInsets.all(22.0),
              constraints: const BoxConstraints(maxWidth: 350),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) {
                            return AlertDialog(
                              content: Image.asset('assets/l.webp'),
                            );
                          },
                        );
                      },
                      child: const Image(
                        image: AssetImage('assets/logo.png'),
                        width: 150,
                        height: 150,
                      ),
                    ),
                    _gap(),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Text(
                        queroEntrar ? "Bem-vindo ao LISA!" : "Crie sua conta",
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        queroEntrar
                            ? "Entre com seu email e senha."
                            : "Preencha os campos abaixo para se cadastrar.",
                        style: Theme.of(context).textTheme.bodySmall,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    _gap(),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      autofillHints: const [AutofillHints.email],
                      textInputAction: TextInputAction.next,
                      validator: (String? value) {
                        if (value!.isEmpty) {
                          return "O campo e-mail deve ser preenchido.";
                        }
                        if (value.length < 6) {
                          return "O campo e-mail deve ter pelo menos 6 caracteres.";
                        }
                        if (!value.contains("@")) {
                          return "O campo e-mail deve conter um @.";
                        }
                        return null;
                      },
                      decoration: const InputDecoration(
                        labelText: 'Email',
                        hintText: 'Digite seu email',
                        prefixIcon: Icon(Icons.email_outlined),
                        border: OutlineInputBorder(),
                      ),
                    ),
                    _gap(),
                    TextFormField(
                      controller: _passwordController,
                      keyboardType: TextInputType.visiblePassword,
                      autofillHints: const [AutofillHints.password],
                      textInputAction: TextInputAction.done,
                      obscureText: !_isPasswordVisible,
                      validator: (String? value) {
                        if (value!.isEmpty) {
                          return "O campo senha deve ser preenchido.";
                        }
                        if (value.length < 8) {
                          return "O campo senha deve ter pelo menos 8 caracteres.";
                        }
                        return null;
                      },
                      decoration: InputDecoration(
                        labelText: 'Senha',
                        hintText: 'Digite sua senha',
                        prefixIcon: const Icon(Icons.lock_outline_rounded),
                        border: const OutlineInputBorder(),
                        suffixIcon: IconButton(
                          icon: Icon(_isPasswordVisible
                              ? Icons.visibility_off
                              : Icons.visibility),
                          onPressed: () {
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                    ),
                    _gap(),
                    Visibility(
                      visible: !queroEntrar,
                      child: Column(
                        children: [
                          TextFormField(
                            keyboardType: TextInputType.visiblePassword,
                            textInputAction: TextInputAction.done,
                            autofillHints: const [AutofillHints.password],
                            obscureText: !_isConfirmPasswordVisible,
                            validator: (String? value) {
                              if (value!.isEmpty) {
                                return "O campo Confirme a senha deve ser preenchido.";
                              }
                              if (value.length < 8) {
                                return "O campo Confirme a senha deve ter pelo menos 8 caracteres.";
                              }
                              if (value != _passwordController.text) {
                                return "As senhas devem ser iguais.";
                              }
                              return null;
                            },
                            decoration: InputDecoration(
                              labelText: 'Confirme a senha',
                              hintText: 'Confirme sua senha',
                              prefixIcon: const Icon(Icons.lock_outline_rounded),
                              border: const OutlineInputBorder(),
                              suffixIcon: IconButton(
                                icon: Icon(_isConfirmPasswordVisible
                                    ? Icons.visibility_off
                                    : Icons.visibility),
                                onPressed: () {
                                  setState(() {
                                    _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                                  });
                                },
                              ),
                            ),
                          ),
                          _gap(),
                          TextFormField(
                            controller: _nameController,
                            keyboardType: TextInputType.name,
                            autofillHints: const [AutofillHints.name],
                            textInputAction: TextInputAction.next,
                            validator: (String? value) {
                              if (value!.isEmpty) {
                                return "O campo Nome Completo deve ser preenchido.";
                              }
                              return null;
                            },
                            decoration: const InputDecoration(
                              labelText: 'Nome Completo',
                              hintText: 'Digite seu nome completo',
                              prefixIcon: Icon(Icons.person_outline),
                              border: OutlineInputBorder(),
                            ),
                          ),
                        ],
                      ),
                    ),
                    _gap(),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                          backgroundColor: queroEntrar ? Colors.green : Colors.blue,
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(10.0),
                          child: Text(
                            queroEntrar ? 'Entrar' : 'Cadastrar',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        onPressed: () {
                          botaoPrincipal();
                        },
                      ),
                    ),
                    _gap(),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          queroEntrar = !queroEntrar;
                        });
                      },
                      child: Text(
                        queroEntrar
                            ? 'Ainda não tem uma conta? Clique aqui!'
                            : 'Já tem uma conta? Clique aqui!',
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _gap() => const SizedBox(height: 16);

  botaoPrincipal() {
    String nome = _nameController.text;
    String email = _emailController.text;
    String senha = _passwordController.text;

    if (_formKey.currentState!.validate()) {
      if (queroEntrar) {
        _autenticacaoServico
            .logarUsuario(email: email, senha: senha)
            .then(
              (String? erro) {
                if (erro != null) {
                  mostrarSnackBar(context: context, texto: erro);
                }
              },
            );
        print('Entrada validada');
      } else {
        _autenticacaoServico
            .cadastrarUsuario(nome: nome, email: email, senha: senha)
            .then(
              (String? erro) {
                if (erro != null) {
                  mostrarSnackBar(context: context, texto: erro);
                } else {
                  mostrarSnackBar(
                    context: context,
                    texto: 'Cadastro efetuado com sucesso!',
                    isError: false,
                  );
                }
              },
            );
        print('Cadastro validado');
      }
    } else {
      print('Form inválido');
    }
  }
}
