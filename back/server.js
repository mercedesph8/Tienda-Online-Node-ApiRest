//Le decimos al servidor que coja cualquier archivo de la carpeta front cuando el navegador lo pida
const frontPath = path.join(__dirname, '../front'); 
app.use(express.static(frontPath)); 
