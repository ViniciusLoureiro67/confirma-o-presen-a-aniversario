/**
 * RSVP Festa Isabela 7 anos
 *
 * Webhook do Google Apps Script para receber confirmações de presença
 * enviadas pela landing page e gravar em uma planilha.
 *
 * Colunas esperadas na aba "RSVP":
 *  A: Timestamp
 *  B: Nome Responsável
 *  C: Telefone
 *  D: Vai Comparecer
 *  E: Tipo Convidado (Responsável | Adulto | Criança)
 *  F: Nome Convidado
 *  G: Idade
 *  H: Paga Buffet (adultos sempre SIM, crianças idade > 6)
 *  I: Observações
 *
 * Regras de gravação:
 *  - Linha "Responsável": sempre gravada (1 por submissão), com
 *    D = SIM/NÃO conforme `responsavelVai` e H em branco quando NÃO.
 *  - Linhas "Adulto"/"Criança": gravadas para cada item em `convidados`,
 *    sempre com D = SIM (a lista representa quem VAI à festa).
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
    // aceita responsavelVai (novo) ou vaiComparecer (legado) por compatibilidade
    const responsavelVai =
      payload.responsavelVai === true || payload.vaiComparecer === true;
    const observacoes = String(payload.observacoes || '').trim();
    const convidados = Array.isArray(payload.convidados) ? payload.convidados : [];

    const rowsToAppend = [];

    rowsToAppend.push([
      timestamp,
      nomeAdulto,
      telefone,
      responsavelVai ? 'SIM' : 'NÃO',
      'Responsável',
      nomeAdulto,
      '',
      responsavelVai ? 'SIM' : '',
      observacoes,
    ]);

    convidados.forEach(function (c) {
      const tipo = c.tipo === 'crianca' ? 'Criança' : 'Adulto';
      const idade = c.tipo === 'crianca' ? Number(c.idade) : null;
      let pagaBuffet;
      if (c.tipo === 'crianca') {
        pagaBuffet = !isNaN(idade) && idade > 6 ? 'SIM' : 'NÃO';
      } else {
        pagaBuffet = 'SIM';
      }
      rowsToAppend.push([
        timestamp,
        nomeAdulto,
        telefone,
        'SIM',
        tipo,
        String(c.nome || '').trim(),
        idade !== null && !isNaN(idade) ? idade : '',
        pagaBuffet,
        observacoes,
      ]);
    });

    rowsToAppend.forEach(function (row) {
      sheet.appendRow(row);
    });

    sendNotificationEmail_(payload, responsavelVai, convidados, rowsToAppend.length);

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

function sendNotificationEmail_(payload, responsavelVai, convidados, totalRows) {
  if (!NOTIFICATION_EMAIL) return;

  try {
    const vai = responsavelVai ? 'SIM' : 'NÃO';
    const adultos = convidados.filter(function (c) { return c.tipo === 'adulto'; });
    const criancas = convidados.filter(function (c) { return c.tipo === 'crianca'; });

    const listaAdultos = adultos.length
      ? adultos.map(function (a) { return '  • ' + a.nome; }).join('\n')
      : '  (nenhum)';
    const listaCriancas = criancas.length
      ? criancas.map(function (c) { return '  • ' + c.nome + ' (' + c.idade + ' anos)'; }).join('\n')
      : '  (nenhuma)';

    const subject = '🎉 Novo RSVP Festa Isabela, ' + payload.nomeAdulto;
    const body =
      'Nova confirmação recebida:\n\n' +
      'Responsável: ' + payload.nomeAdulto + '\n' +
      'Telefone: ' + payload.telefone + '\n' +
      'Responsável vai: ' + vai + '\n\n' +
      'Outros adultos:\n' + listaAdultos + '\n\n' +
      'Crianças:\n' + listaCriancas + '\n\n' +
      'Observações: ' + (payload.observacoes || '(nenhuma)') + '\n\n' +
      'Linhas gravadas na planilha: ' + totalRows;

    MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
  } catch (err) {
    console.warn('Falha ao enviar e-mail de notificação:', err);
  }
}
