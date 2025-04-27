import { SwapRequestEmail } from '../emails/SwapRequestEmail';
import { render } from '@react-email/render';

export interface SwapRequestEmailData {
  swapId: string;
  fromEmployee: string;
  toEmployee: string;
  fromShift: string;
  toShift: string;
  date: string;
}

export async function sendSwapRequestEmail(data: SwapRequestEmailData) {
  try {
    console.log('Iniziando invio email con dati:', data);
    
    // Per sviluppo locale, usa localhost:5173
    const baseUrl = 'http://localhost:5173';
    console.log('Base URL:', baseUrl);

    // Renderizza il template email
    const emailHtml = await render(
      SwapRequestEmail({
        swapId: data.swapId,
        requesterName: data.fromEmployee,
        requestedName: data.toEmployee,
        requesterShift: data.fromShift,
        requestedShift: data.toShift,
        baseUrl: baseUrl,
      })
    );
    console.log('Email template renderizzato');

    // Invia l'email tramite la serverless function
    const response = await fetch('/api/send-swap-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'saxarubra915@gmail.com',
        subject: 'Richiesta di autorizzazione scambio turno',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      throw new Error(`Errore nell'invio dell'email: ${response.statusText}`);
    }

    console.log('Email inviata con successo');
    return { success: true };
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    throw error;
  }
} 