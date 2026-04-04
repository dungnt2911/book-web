const fetch = require('node-fetch');

exports.chatAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "Ông giáo định hỏi gì thế?" });

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-3-super-120b-a12b:free",
                messages: [
    { 
        role: "user", 
        content: `Bạn là trợ lý ảo tiệm sách "Nhã Thư", nhã nhặn lịch sự, gọi khách là "ông giáo". Trả lời 2-3 câu.\n\nKhách hỏi: ${message}` 
    }
]
            })
        });

        const data = await response.json();
        
        // In ra để xem response thực tế
        console.log("OpenRouter response:", JSON.stringify(data, null, 2));

        // Kiểm tra trước khi lấy text
        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else if (data.error) {
            console.error("OpenRouter error:", data.error);
            res.json({ reply: "AI đang bận, ông giáo thử lại nhé!" });
        } else {
            res.json({ reply: "Không nhận được phản hồi từ AI." });
        }

    } catch (error) {
        console.error("Lỗi AI:", error.message);
        res.status(500).json({ reply: "AI đang bận đọc sách, ông giáo đợi tí nhé!" });
    }
};