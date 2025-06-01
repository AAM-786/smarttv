import { useState, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  language: 'english' | 'hindi' | 'marathi';
  category: 'morning' | 'afternoon' | 'evening' | 'night';
}

const messages: Message[] = [
  // English Messages
  { id: 1, text: "Welcome to a new day full of possibilities! ☀️", language: 'english', category: 'morning' },
  { id: 2, text: "Rise and shine! Today is your canvas to paint success.", language: 'english', category: 'morning' },
  { id: 3, text: "Every sunrise brings new opportunities. Embrace them!", language: 'english', category: 'morning' },
  { id: 4, text: "Good morning! Let your dreams fuel your determination.", language: 'english', category: 'morning' },
  { id: 5, text: "The early bird catches the worm. Start strong today!", language: 'english', category: 'morning' },
  { id: 6, text: "Morning coffee and positive thoughts - perfect combination!", language: 'english', category: 'morning' },
  
  { id: 7, text: "Afternoon sunshine brings clarity to your thoughts.", language: 'english', category: 'afternoon' },
  { id: 8, text: "Keep pushing forward! The day is still young.", language: 'english', category: 'afternoon' },
  { id: 9, text: "Lunch break wisdom: Small steps lead to big achievements.", language: 'english', category: 'afternoon' },
  { id: 10, text: "Midday motivation: You're halfway to greatness!", language: 'english', category: 'afternoon' },
  { id: 11, text: "Afternoon energy boost: Channel your inner strength.", language: 'english', category: 'afternoon' },
  { id: 12, text: "The sun is high, and so should be your spirits!", language: 'english', category: 'afternoon' },
  
  { id: 13, text: "Evening reflections bring tomorrow's inspirations.", language: 'english', category: 'evening' },
  { id: 14, text: "Sunset reminds us that endings can be beautiful too.", language: 'english', category: 'evening' },
  { id: 15, text: "Good evening! Celebrate today's accomplishments.", language: 'english', category: 'evening' },
  { id: 16, text: "As the day winds down, your spirit should wind up!", language: 'english', category: 'evening' },
  { id: 17, text: "Evening breeze carries dreams for tomorrow.", language: 'english', category: 'evening' },
  { id: 18, text: "Golden hour thoughts: You are capable of amazing things!", language: 'english', category: 'evening' },
  
  { id: 19, text: "Good night! Stars shine brightest in darkness.", language: 'english', category: 'night' },
  { id: 20, text: "Night time is thinking time. Plan your next victory.", language: 'english', category: 'night' },
  { id: 21, text: "Sweet dreams are made of hard work and determination.", language: 'english', category: 'night' },
  { id: 22, text: "The moon whispers: Rest well, dream big.", language: 'english', category: 'night' },
  { id: 23, text: "Night brings peace to the soul and clarity to the mind.", language: 'english', category: 'night' },
  { id: 24, text: "Sleep tight! Tomorrow awaits your brilliance.", language: 'english', category: 'night' },

  // Hindi Messages
  { id: 25, text: "नया दिन, नई उम्मीदें! आज का दिन शुभ हो। 🌅", language: 'hindi', category: 'morning' },
  { id: 26, text: "सुप्रभात! हर सुबह एक नया अवसर लेकर आती है।", language: 'hindi', category: 'morning' },
  { id: 27, text: "उठो, जागो और अपने सपनों को साकार करो!", language: 'hindi', category: 'morning' },
  { id: 28, text: "सूर्योदय के साथ नई शुरुआत का स्वागत करें।", language: 'hindi', category: 'morning' },
  { id: 29, text: "प्रातःकाल की शुद्ध हवा में सफलता की खुशबू है।", language: 'hindi', category: 'morning' },
  { id: 30, text: "सवेरे की चाय और सकारात्मक विचार - दिन की शुरुआत!", language: 'hindi', category: 'morning' },
  
  { id: 31, text: "दोपहर की धूप में भी ठंडक से काम लो।", language: 'hindi', category: 'afternoon' },
  { id: 32, text: "मध्याह्न संदेश: मेहनत का फल मीठा होता है।", language: 'hindi', category: 'afternoon' },
  { id: 33, text: "दोपहर का समय है, उर्जा बनाए रखें!", language: 'hindi', category: 'afternoon' },
  { id: 34, text: "सूर्य उच्च पर है, आपका उत्साह भी होना चाहिए।", language: 'hindi', category: 'afternoon' },
  { id: 35, text: "दोपहर की शांति में अपनी शक्ति खोजें।", language: 'hindi', category: 'afternoon' },
  { id: 36, text: "मध्याह्न प्रेरणा: छोटे कदम, बड़ी मंजिल!", language: 'hindi', category: 'afternoon' },
  
  { id: 37, text: "शाम की मधुरता में कल की तैयारी करें।", language: 'hindi', category: 'evening' },
  { id: 38, text: "सूर्यास्त सिखाता है कि अंत भी सुंदर हो सकता है।", language: 'hindi', category: 'evening' },
  { id: 39, text: "शुभ संध्या! आज की उपलब्धियों का जश्न मनाएं।", language: 'hindi', category: 'evening' },
  { id: 40, text: "शाम की हवा में कल के सपने तैरते हैं।", language: 'hindi', category: 'evening' },
  { id: 41, text: "संध्या काल में मन की शांति पाएं।", language: 'hindi', category: 'evening' },
  { id: 42, text: "शाम का सुनहरा समय: आप अद्भुत हैं!", language: 'hindi', category: 'evening' },
  
  { id: 43, text: "शुभ रात्रि! तारे अंधेरे में सबसे चमकीले होते हैं।", language: 'hindi', category: 'night' },
  { id: 44, text: "रात्रि विचार का समय है। कल की जीत की योजना बनाएं।", language: 'hindi', category: 'night' },
  { id: 45, text: "मीठे सपने मेहनत और दृढ़ता से बनते हैं।", language: 'hindi', category: 'night' },
  { id: 46, text: "चांद कहता है: अच्छी तरह आराम करो, बड़े सपने देखो।", language: 'hindi', category: 'night' },
  { id: 47, text: "रात आत्मा को शांति और मन को स्पष्टता देती है।", language: 'hindi', category: 'night' },
  { id: 48, text: "गहरी नींद लो! कल आपकी प्रतिभा का इंतजार कर रहा है।", language: 'hindi', category: 'night' },

  // Marathi Messages
  { id: 49, text: "नवीन दिवस, नवीन आशा! आजचा दिवस शुभ असो। 🌄", language: 'marathi', category: 'morning' },
  { id: 50, text: "सुप्रभात! प्रत्येक सकाळ नवीन संधी घेऊन येते।", language: 'marathi', category: 'morning' },
  { id: 51, text: "उठा, जागा आणि तुमची स्वप्ने साकार करा!", language: 'marathi', category: 'morning' },
  { id: 52, text: "सूर्योदयासह नवीन सुरुवातीचे स्वागत करा।", language: 'marathi', category: 'morning' },
  { id: 53, text: "पहाटेच्या शुद्ध हवेत यशाचा सुगंध आहे।", language: 'marathi', category: 'morning' },
  { id: 54, text: "सकाळचा चहा आणि सकारात्मक विचार - दिवसाची सुरुवात!", language: 'marathi', category: 'morning' },
  
  { id: 55, text: "दुपारच्या उन्हातही थंडपणे काम करा।", language: 'marathi', category: 'afternoon' },
  { id: 56, text: "मध्यान्ह संदेश: मेहनतीचे फळ गोड असते।", language: 'marathi', category: 'afternoon' },
  { id: 57, text: "दुपारची वेळ आहे, उर्जा टिकवून ठेवा!", language: 'marathi', category: 'afternoon' },
  { id: 58, text: "सूर्य उंचावर आहे, तुमचा उत्साहही असावा।", language: 'marathi', category: 'afternoon' },
  { id: 59, text: "दुपारच्या शांततेत आपली शक्ती शोधा।", language: 'marathi', category: 'afternoon' },
  { id: 60, text: "मध्यान्ह प्रेरणा: छोटी पावले, मोठे गंतव्य!", language: 'marathi', category: 'afternoon' },
  
  { id: 61, text: "संध्याकाळच्या मधुरतेत उद्याची तयारी करा।", language: 'marathi', category: 'evening' },
  { id: 62, text: "सूर्यास्त शिकवतो की अंत सुद्धा सुंदर असू शकतो।", language: 'marathi', category: 'evening' },
  { id: 63, text: "शुभ संध्याकाळ! आजच्या यशाचा उत्सव साजरा करा।", language: 'marathi', category: 'evening' },
  { id: 64, text: "संध्याकाळच्या वार्‍यात उद्याची स्वप्ने तरंगतात।", language: 'marathi', category: 'evening' },
  { id: 65, text: "संध्याकाळी मनाची शांती मिळवा।", language: 'marathi', category: 'evening' },
  { id: 66, text: "संध्याकाळचा सुवर्ण काळ: तुम्ही अप्रतिम आहात!", language: 'marathi', category: 'evening' },
  
  { id: 67, text: "शुभ रात्री! तारे अंधारात सर्वात चमकदार असतात।", language: 'marathi', category: 'night' },
  { id: 68, text: "रात्रीची वेळ विचाराची आहे. उद्याच्या विजयाची योजना करा।", language: 'marathi', category: 'night' },
  { id: 69, text: "गोड स्वप्ने मेहनत आणि दृढतेने बनतात।", language: 'marathi', category: 'night' },
  { id: 70, text: "चंद्र म्हणतो: चांगली विश्रांती घ्या, मोठी स्वप्ने पहा।", language: 'marathi', category: 'night' },
  { id: 71, text: "रात्र आत्म्याला शांती आणि मनाला स्पष्टता देते।", language: 'marathi', category: 'night' },
  { id: 72, text: "खोल झोप घ्या! उद्या तुमच्या प्रतिभेची वाट पाहत आहे।", language: 'marathi', category: 'night' },
];

export function useDynamicMessages() {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'english' | 'hindi' | 'marathi'>('english');

  useEffect(() => {
    const updateMessage = () => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // Determine time category
      let category: 'morning' | 'afternoon' | 'evening' | 'night';
      if (hour >= 5 && hour < 12) category = 'morning';
      else if (hour >= 12 && hour < 17) category = 'afternoon';
      else if (hour >= 17 && hour < 22) category = 'evening';
      else category = 'night';

      // Filter messages by current language and time category
      const filteredMessages = messages.filter(
        msg => msg.language === currentLanguage && msg.category === category
      );

      // Select message based on hour and day of year for variety
      const messageIndex = (hour + dayOfYear) % filteredMessages.length;
      setCurrentMessage(filteredMessages[messageIndex]);
    };

    updateMessage();
    
    // Update every hour
    const interval = setInterval(updateMessage, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentLanguage]);

  const changeLanguage = () => {
    const languages: ('english' | 'hindi' | 'marathi')[] = ['english', 'hindi', 'marathi'];
    const currentIndex = languages.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % languages.length;
    setCurrentLanguage(languages[nextIndex]);
  };

  return {
    currentMessage,
    currentLanguage,
    changeLanguage,
  };
}