/**
 * RSVP Festa Isabela 7 anos
 *
 * Webhook do Google Apps Script para receber confirmações de presença
 * enviadas pela landing page e gravar em uma planilha.
 *
 * Colunas esperadas na aba "RSVP":
 *  A: Timestamp
 *  B: Nome Adulto
 *  C: Telefone
 *  D: Vai Comparecer
 *  E: Nome Criança
 *  F: Idade Criança
 *  G: Paga Buffet (idade > 6)
 *  H: Acompanhante
 *  I: Observações
 */

const NOTIFICATION_EMAIL = 'kayronedias1482@gmail.com';
const SHEET_NAME = 'RSVP';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Aba "' + SHEET_NAME + '" não encontrada na planilha.');
    }

    const timestamp = new Date();
    const nomeAdulto = String(payload.nomeAdulto || '').trim();
    const telefone = String(payload.telefone || '').trim();
    const vaiComparecer = payload.vaiComparecer === true;
    const observacoes = String(payload.observacoes || '').trim();
    const criancas = Array.isArray(payload.criancas) ? payload.criancas : [];

    const rowsToAppend = [];

    if (vaiComparecer && criancas.length > 0) {
      criancas.forEach(function (c) {
        const idade = Number(c.idade);
        const pagaBuffet = idade > 6 ? 'SIM' : 'NÃO';
        rowsToAppend.push([
          timestamp,
          nomeAdulto,
          telefone,
          'SIM',
          String(c.nome || '').trim(),
          isNaN(idade) ? '' : idade,
          pagaBuffet,
          String(c.acompanhante || '').trim(),
          observacoes,
        ]);
      });
    } else {
      rowsToAppend.push([
        timestamp,
        nomeAdulto,
        telefone,
        vaiComparecer ? 'SIM' : 'NÃO',
        '',
        '',
        '',
        '',
        observacoes,
      ]);
    }

    rowsToAppend.forEach(function (row) {
      sheet.appendRow(row);
    });

    sendNotificationEmail_(payload, rowsToAppend.length);

    return jsonResponse_({ success: true });
  } catch (err) {
    console.error(err);
    return jsonResponse_({ success: false, error: String(err && err.message ? err.message : err) });
  }
}

function doGet() {
  return jsonResponse_({ ok: true, service: 'rsvp-isabela' });
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sendNotificationEmail_(payload, totalRows) {
  if (!NOTIFICATION_EMAIL) return;

  try {
    const vai = payload.vaiComparecer ? 'SIM' : 'NÃO';
    const criancas = Array.isArray(payload.criancas) ? payload.criancas : [];
    const listaCriancas = criancas.length
      ? criancas.map(function (c) {
          const acomp = c.acompanhante ? ' (acompanhante: ' + c.acompanhante + ')' : '';
          return '  • ' + c.nome + ' (' + c.idade + ' anos)' + acomp;
        }).join('\n')
      : '  (nenhuma criança informada)';

    const subject = '🎉 Novo RSVP Festa Isabela, ' + payload.nomeAdulto;
    const body =
      'Nova confirmação recebida:\n\n' +
      'Responsável: ' + payload.nomeAdulto + '\n' +
      'Telefone: ' + payload.telefone + '\n' +
      'Vai comparecer: ' + vai + '\n' +
      'Crianças:\n' + listaCriancas + '\n\n' +
      'Observações: ' + (payload.observacoes || '(nenhuma)') + '\n\n' +
      'Linhas gravadas na planilha: ' + totalRows;

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
  } catch (err) {
    console.warn('Falha ao enviar e-mail de notificação:', err);
  }
}
