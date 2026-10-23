Am facut o pagina web folosind HTML, CSS si JavaScript.
API-ul folosit este https://jsonplaceholder.typicode.com/posts.
Pentru a deschide pagina, pornesc Apache din XAMPP si intru pe http://localhost/tema_siteWeb/index.html.
Postarile sunt luate din API prin GET, iar pagina arata cand se incarca, cand apare o eroare sau cand lista este goala.
Prin formular pot trimite o postare cu POST, folosind FormData si JSON, cu Content-Type: application/json.
La codul 200 afisez lista, iar la 201 adaug postarea noua in lista fara sa incarc iar datele din API.
Verific response.ok, iar la erori 4xx/5xx afisez mesajul serverului sau codul erorii; daca nu merge conexiunea, afisez un mesaj general.
Nu am facut setari pentru CORS, deoarece serverul JSONPlaceholder permite cereri de pe alte site-uri.
Cautarea filtreaza postarile dupa titlu in JavaScript, cu delegarea evenimentelor; am testat pagina la 360 px, iar postarile noi dispar dupa refresh.