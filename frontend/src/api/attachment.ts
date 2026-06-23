import api from './client';

export const attachmentApi = {
  upload: (mocId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post(`/mocs/${mocId}/attachments`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
