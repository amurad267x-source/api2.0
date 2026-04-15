const express = require('express');
const acme = require('acme-client');
const app = express();

app.use(express.json());

// Главная страница, чтобы проверить, что сервис жив
app.get('/', (req, res) => {
    res.send('API Генератора ключей работает!');
});

app.post('/generate-csr', async (req, res) => {
    try {
        const { domain } = req.body;
        if (!domain) return res.status(400).json({ error: 'Домен не указан' });

        console.log(`Генерирую ключи для: ${domain}`);

        // Генерация ключа аккаунта и CSR (на Render нет лимита в 50мс)
        const accountKey = await acme.crypto.createPrivateKey();
        const [key, csr] = await acme.crypto.createCsr({ commonName: domain });
        
        res.json({
            accountKey: accountKey.toString(),
            key: key.toString(),
            csr: csr.toString()
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
