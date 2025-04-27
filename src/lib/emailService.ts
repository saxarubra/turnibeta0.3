import { render } from '@react-email/render';
import SwapRequestEmail from '../emails/SwapRequestEmail';

interface SwapRequestEmailData {
  requesterName: string;
  requestedName: string;
  requesterShift: string;
  requestedShift: string;
  swapId: string;
}

export async function sendSwapRequestEmail(data: SwapRequestEmailData) {
  try {
    console.log('===== INIZIO INVIO EMAIL =====');
    console.log('Dati ricevuti per l\'email:', data);
    
    // Determina l'URL base in base all'ambiente
    const isDevelopment = import.meta.env.DEV;
    const baseUrl = isDevelopment 
      ? 'http://localhost:5173' 
      : import.meta.env.VITE_APP_URL || 'https://turnibeta0.3.vercel.app';
    
    console.log('URL base per i link nell\'email:', baseUrl);
    console.log('Ambiente:', isDevelopment ? 'sviluppo' : 'produzione');
    
    // Render the email template
    console.log('Rendering del template email...');
    const emailHtml = await render(
      SwapRequestEmail({
        requesterName: data.requesterName,
        requestedName: data.requestedName,
        requesterShift: data.requesterShift,
        requestedShift: data.requestedShift,
        swapId: data.swapId,
        baseUrl: baseUrl,
      })
    );
    
    console.log('Template email renderizzato con successo');
    
    // In development, simulate email sending
    if (isDevelopment) {
      console.log('===== SIMULAZIONE INVIO EMAIL =====');
      console.log('Destinatario: saxarubra915@gmail.com');
      console.log('Oggetto: Richiesta di autorizzazione scambio turno');
      console.log('Lunghezza HTML: ', emailHtml.length, ' caratteri');
      console.log('URL di autorizzazione: ', `${baseUrl}/api/swaps/${data.swapId}/authorize`);
      console.log('URL di rifiuto: ', `${baseUrl}/api/swaps/${data.swapId}/reject`);
      console.log('===== FINE SIMULAZIONE EMAIL =====');
      
      return { success: true, message: 'Email simulata con successo' };
    } 
    // In production, use Resend
    else {
      console.log('===== INVIO EMAIL CON RESEND =====');
      
      // Verifica che l'API key sia presente
      const resendApiKey = import.meta.env.VITE_RESEND_API_KEY;
      if (!resendApiKey) {
        console.error('API key di Resend non trovata');
        return { success: false, error: 'API key di Resend non trovata' };
      }
      
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: import.meta.env.VITE_EMAIL_FROM || 'noreply@turni.com',
            to: 'saxarubra915@gmail.com',
            subject: 'Richiesta di autorizzazione scambio turno',
            html: emailHtml,
          }),
        });
        
        const responseData = await res.json();
        console.log('Risposta da Resend:', responseData);
        
        if (res.ok) {
          console.log('Email inviata con successo tramite Resend');
          return { success: true, data: responseData };
        } else {
          console.error('Errore nell\'invio dell\'email tramite Resend:', responseData);
          return { success: false, error: responseData };
        }
      } catch (error) {
        console.error('Errore nella chiamata a Resend:', error);
        return { success: false, error };
      }
    }
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error);
    return { success: false, error };
  }
} 