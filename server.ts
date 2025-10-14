import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bookFormRoutes from "./routes/web/book.form.routes.js";
import bookApiRoutes from "./routes/api/book.api.routes.js";

const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS
app.use(cors({
  	origin: "http://localhost:5000"
}));

// Routes
app.use("/", bookFormRoutes);   // Pour le formulaire
app.use("/api", bookApiRoutes); // Pour les données JSON

// Page d’accueil
app.get("/", (req, res) => {
	res.send(`
		<h2>Bienvenue sur le serveur 📚</h2>
		<ul>
			<li><a href="/add-book">Ajouter un livre</a></li>
			<li><a href="/api/books">Voir les livres (API JSON)</a></li>
		</ul>
	`);
});

// Lancement du serveur
app.listen(port, () => {
	console.log(`✅ Serveur lancé sur http://localhost:${port}`);
});
