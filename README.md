<p align="center">
  <img src="https://github.com/user-attachments/assets/5016809a-9f26-4624-b1ce-1fc191482fb9" width="420" alt="Fiap + Alura" />
</p>

<p align="center">Software Architecture Tech Challenge - Fase 4</p>
<p align="center">Grupo 18 - Felipe Alves Leal</p>

# Microserviço Pagamento

Responsável por operacionalizar o processo de pedidos, registrando os pedidos, retornando as informações necessárias para montar um pedido, listando os pedidos registrados e em processo de produção (visão de cliente). 

## 📄 Descrição

Este projeto é parte do **Software Architecture Tech Challenge - Fase 2**. Ele engloba o desenvolvimento de uma aplicação backend monolítica utilizando **NestJS** e seguindo boas práticas de **DDD (Domain-Driven Design)**, **Clean Code e Clean Architecture:**, **Docker**, **Kubernetes** para uma implementação robusta e escalável.

## 🛠 Tecnologias Utilizadas

- Node.js (>=20)
- NestJS
- Prisma ORM
- Docker e Docker Compose
- PostgreSQL
- Swagger (Documentação de APIs)
- Clean Code
- Clean Architecture
- Kubernetes

## 🌐 Recursos Adicionais

- [Documentação do NestJS](https://docs.nestjs.com/)
- [Prisma ORM](https://www.prisma.io/docs/orm)
- [Docker Documentation](https://docs.docker.com/)

## 🎥 Demo

[![Video demonstração](https://img.youtube.com/vi/tynOvtxLzq0/0.jpg)](https://www.youtube.com/watch?v=tynOvtxLzq0)

## 🚀 Instruções para Instalação

Clone o repositorio para seu ambiente

```bash
git clone git@github.com:lealfelipealves/fiap-soat-architecture.git
```

Acesse o repositório

```bash
cd fiap-soat-architecture/
```

Copie o arquivo .env.example para .env

```bash
cp .env.example .env
```

Subir o ambiente completo:

```bash
docker-compose up -d
```

Aplicar migrações do Prisma na base de dados:

```bash
npx prisma migrate deploy
```

Popular a base com dados iniciais (Seed):

```bash
npm install;
npx prisma db seed;
```

## 📖 Swagger

Para acessar a documentação do swagger

<a href="http://localhost:3333/docs" target="_blank">Link para acessar o swagger localmente</a>

```bash
http://localhost:3333/docs
```

![image](https://github.com/user-attachments/assets/2186718b-0ab3-4af1-8267-1514fe908153)

## ▶️ Executar o projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ▶️ K8s

```bash
$ minikube start

$ kubectl apply -f k8s/

$ kubectl get pods

$ kubectl get hpa

$ kubectl get svc

$ minikube service fastfood-service

$ kubectl run fortio --rm -i --tty --image=fortio/fortio -- load -qps 800 -t 60s -c 100 "http://fastfood-service/orders"
```

## Entregáveis FASE 2:

<ol type="1">
  <li>
    Atualizar a aplicação desenvolvida na FASE 1 refatorando o código para seguir os padrões Clean Code e Clean Architecture:
    <ol type="a">
      <li>Alterar/criar as APIs:</li>
      <ol type="i">
        <li>Checkout Pedido que deverá receber os produtos solicitados e retornar a identificação do pedido.</li>
        <li>Consultar status de pagamento pedido, que informa se o pagamento foi aprovado ou não.</li>
        <li>Webhook para receber confirmação de pagamento aprovado ou recusado, a implementação deve ser clara quanto ao Webhook.</li>
        <li>A lista de pedidos deverá retorná-los com suas descrições, ordenados com a seguinte regra:
          <ol type="1">
            <li>Pronto > Em Preparação > Recebido;</li>
            <li>Pedidos mais antigos primeiro e mais novos depois;</li>
            <li>Pedidos com status Finalizado não devem aparecer na lista.</li>
          </ol>
        </li>
        <li>Atualizar o status do pedido.
          <ol type="1">
              <li>Todo fluxo do pedido deve ser atualizado, tal informação deverá ser utilizada pela cozinha, garantindo que nenhum pedido seja perdido e que a cozinha possa iniciar a preparação após o pagamento. WebHook para capturar os pagamentos. Caso contrário, será necessário realizar o mock da parte de pagamentos. Como referência, acesse: site do mercado pago.</li>
          </ol>
        </li>
      </ol>
    </ol>
  </li>
  <li>
    Criar uma arquitetura em Kubernetes que atenda os seguintes requisitos: 
    <ol type="a">
      <li>Os requisitos funcionais descritos nos itens anteriores (item problema).</li>
      <li>Escalabilidade com aumento e diminuição de Pods conforme demanda (HPA).</li>
      <li>Os arquivos manifestos (yaml) precisam estar no Github junto com a nova versão do código.</li>
      <li>Seguir boas práticas de segurança, utilizando ConfigMap e Secrets para valores sensíveis.</li>
      <li>Seguir boas práticas de arquitetura, sempre utilizando Deployment e Service para expor a aplicação. </li>
    </ol>
  </li>
</ol>

## 📊 Clean Arch:

<ul>
  <li>
    <img width="842" alt="desenho-topico3-felipe-leal-grupo-30-fase-2@2x" src="https://github.com/user-attachments/assets/b4f65f02-fae5-4e2a-8be5-6010242aebee" />
    <a href="https://github.com/lealfelipealves/fiap-soat-architecture/blob/main/docs/desenho-topico3-felipe-leal-grupo-30-fase-2.pdf" target="_blank">
    Diagrama Arquitetura K8s</a>
  </li>
  <li>
    <img width="1356" alt="clean_arch-felipe-leal-grupo-30-fase-2" src="https://github.com/user-attachments/assets/2180b32a-790e-4fa3-b97b-3f023f706769" />
    <a href="https://github.com/lealfelipealves/fiap-soat-architecture/blob/main/docs/clean_arch-felipe-leal-grupo-30-fase-2.pdf" target="_blank">
    Diagrama Arquitetura Clean Arch</a>
  </li>
</ul>

### Autor

---

<a href="https://github.com/lealfelipealves">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/17007124?v=4" width="100px;" alt=""/>
 <br />
 <sub><b>Felipe Leal</b></sub></a> <a href="https://github.com/lealfelipealves" title="Felipe Leal Profile">🚀</a>

Feito por Felipe Leal 👋🏽

[![Gmail Badge](https://img.shields.io/badge/-contato@felipeleal.eng.br-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:contato@felipeleal.eng.br)](mailto:contato@felipeleal.eng.br)
