# Entenda o Globomap

O Globomap possui 3 itens fundamentais para construirmos os mais variados tipos de consulta, são eles: *Collection*, *Edge* e *Graph*.

## Collection
Uma collection é a representação principal de um recurso dentro do Globomap. Um servidor, um DNS, um time e até um usuário do LDAP são exemplos de collections. 

## Edge
São os elementos que ligam as collections umas com as outras.

## Graph
Estes são os elementos que dão sentido às ligações entre uma ou mais collections. Por exemplo o graph de Custeio agrupa as collections de cliente, processo, componentes, etc, junto com suas ligações (edges). O graph de Balanceamento agrupa host, VIP e POOL.


Tanto as Collections quanto as Edges possuem propriedades. Você pode procurar por um item através também destas propriedades na *busca avançada*.
