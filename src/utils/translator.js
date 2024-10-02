import axios from 'axios';

export const translateText = async (text, targetLanguage) => {
  console.log('Translating text:', text, 'to', targetLanguage);
  if(!text|| text==='undefined') {
    return 'hello';
  }
  try {
    const response = await axios.post('http://localhost:8081/translate', {
      q: text.toString(),
      target: targetLanguage.toString(),
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};