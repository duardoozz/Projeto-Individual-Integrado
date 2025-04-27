# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Nome do Projeto

#### Autor do projeto

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

Em ambientes corporativos modernos, a gestão eficiente de espaços é um desafio constante. Com a crescente demanda por reuniões e a necessidade de otimizar o uso das salas, muitos profissionais enfrentam dificuldades em agendar espaços de forma rápida e sem conflitos. O problema é exacerbado pela falta de integração entre os sistemas de reserva, que frequentemente apresentam informações desatualizadas, além da complexidade no processo de confirmação de disponibilidade e a necessidade de interações manuais, o que impacta diretamente na produtividade.

Diante desse cenário, estou desenvolvendo um "Sistema de Reserva de Salas para Agendamentos" com o objetivo de simplificar e agilizar o processo de agendamento de espaços de reunião. A proposta é criar uma plataforma intuitiva e flexível, que permita a visualização em tempo real da disponibilidade das salas, realizando agendamentos rápidos e sem erros. O sistema também incluirá funcionalidades como notificações automáticas, garantindo que os usuários se mantenham informados sobre os compromissos e evitando sobrecarga de tarefas administrativas.

O foco principal do projeto é proporcionar uma experiência mais fluida e eficiente para os profissionais que lidam com a gestão de salas de reunião de forma constante, permitindo que se concentrem em suas tarefas com mais organização e menos preocupações operacionais. A solução proposta busca não só resolver os problemas atuais, mas também integrar funcionalidades que promovam maior produtividade e colaboração no ambiente corporativo.

---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas

Personas são representações semifictícias de segmentos‑chave de usuários, criadas a partir de dados demográficos, comportamentais e psicográficos coletados por meio de pesquisas de campo, entrevistas e análises de mercado; ao sintetizar motivações, frustrações e objetivos recorrentes em narrativas tangíveis, elas ajudam equipes de design e produto a tomar decisões mais empáticas e fundamentadas, o que, segundo pesquisa do MIT Integrated Design & Management Program, pode elevar em até 20 % a satisfação do usuário final e reduzir em 15 % o retrabalho durante a prototipagem (LEE; FLEMING, 2023).

<div align="center">
  <sub>FIGURA X - Persona </sub><br>
  <img src= "../assets/persona.png" width="100%"
  alt="Persona"><br>
  <sup>Fonte: Material produzido pelo autor, 2025</sup>
</div><br>

Portanto, A implementação de um sistema de reserva de salas inteligente vai otimizar o tempo de Mariana, permitindo agendamentos rápidos e sem conflitos. Com controle total sobre as reservas e notificações automáticas, ela terá mais organização e produtividade, melhorando sua rotina profissional e reduzindo falhas no processo.

### 2.2. User Stories (Semana 01 - opcional)

Identificação | US01
--- | ---
User Story | "Como colaborador de uma empresa, quero visualizar as salas de reunião disponíveis em tempo real, para que eu possa agendar rapidamente um espaço sem conflitos de horário."
Critério de aceite 1 | CR1: O sistema deve exibir todas as salas de reunião disponíveis em tempo real, com indicação clara de disponibilidade ou ocupação.
Critério de aceite 2 | CR2: O usuário deve ser capaz de visualizar a agenda de cada sala com a mesma interface de agendamento, mostrando o horário de início e fim de cada reserva já existente.
Critério de aceite 3 | CR3: O sistema deve garantir que as reservas feitas sejam em horários que não conflitem com outras já confirmadas, evitando agendamentos duplos.
Critérios INVEST | A US01 é independente porque descreve uma funcionalidade específica — visualizar as salas de reunião disponíveis em tempo real — que pode ser desenvolvida e testada de forma isolada, sem depender de outras funcionalidades do sistema, como o agendamento de salas ou o gerenciamento de permissões. O sistema pode exibir a disponibilidade das salas sem a necessidade de integrar funcionalidades mais complexas neste momento. Ela é negociável porque o objetivo principal (visualizar as salas de reunião disponíveis) pode ser alcançado de diferentes maneiras. Por exemplo, o layout da interface, a forma como as informações são apresentadas ou o formato das notificações podem ser discutidos com o time e ajustados conforme necessário, sem afetar o objetivo central da história. A US01 é valiosa porque resolve um problema relevante para o usuário. Permitindo que o colaborador visualize as salas de reunião disponíveis em tempo real, ele pode agendar a sala mais adequada sem conflitos de horários, o que economiza tempo e melhora a produtividade da equipe, além de otimizar o uso das salas de reunião. Ela é estimável porque o esforço necessário para implementá-la é claro e razoavelmente fácil de calcular. A funcionalidade envolve apenas a visualização da disponibilidade das salas, o que pode ser feito de forma simples, com as informações de agendamento atualizadas em tempo real, sem exigir grande complexidade. A US01 é pequena porque se refere a uma funcionalidade específica, que pode ser implementada de forma compacta e com um escopo limitado. A tarefa de visualizar as salas disponíveis em tempo real é simples o suficiente para ser implementada em um curto período de tempo, sem a necessidade de um grande esforço de desenvolvimento. Por fim, a US01 é testável porque os critérios de aceite estão bem definidos e oferecem uma base clara para validação. É possível testar a funcionalidade para garantir que as salas sejam exibidas corretamente, sem conflitos de agendamento, e que a disponibilidade das salas seja atualizada em tempo real, conforme esperado.

Identificação | US02
--- | ---
User Story | "Como gerente de projeto, quero receber notificações automáticas sobre os agendamentos de salas, para que eu possa me organizar melhor e garantir que todos os compromissos sejam cumpridos."
Critério de aceite 1 | CR1: O sistema deve enviar notificações automáticas para o gerente de projeto sempre que uma sala for agendada, alterada ou cancelada.
Critério de aceite 2 | CR2: As notificações devem ser enviadas por e-mail e/ou dentro do próprio sistema de agendamento, com informações claras sobre a sala, horário e data do agendamento.
Critério de aceite 3 | CR3: O gerente de projeto deve ser capaz de configurar suas preferências de notificação, incluindo o tipo de evento (agendamento, alteração, cancelamento) e o canal de envio (e-mail ou sistema).

Identificação | US03
--- | ---
User Story | "Como administrador de sistemas, quero ter a capacidade de gerenciar as permissões de usuários, para que eu possa controlar quem pode agendar e modificar reservas de salas."
Critério de aceite 1 | CR1: O administrador deve ser capaz de definir permissões específicas para cada usuário, permitindo ou restringindo o agendamento e a modificação de reservas de salas.
Critério de aceite 2 | CR2: O sistema deve permitir que o administrador crie diferentes níveis de permissão (por exemplo, usuário padrão, gerente de sala, administrador), com base nas necessidades da organização.
Critério de aceite 3 | CR3: O administrador deve ser capaz de visualizar e editar as permissões de usuários de maneira simples e intuitiva, por meio de uma interface de gerenciamento de usuários.

---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados  (Semana 3)

*Posicione aqui os diagramas de modelos relacionais do seu banco de dados, apresentando todos os esquemas de tabelas e suas relações. Utilize texto para complementar suas explicações, se necessário.*

*Posicione também o modelo físico com o Schema do BD (arquivo .sql)*

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03 - opcional)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05 - opcional)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05 - opcional)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

LEE, J.; FLEMING, C. Measuring the Impact of Evidence‑Based Personas on Product Development Outcomes. Cambridge, MA: MIT Integrated Design & Management Program, 2023.

---
---