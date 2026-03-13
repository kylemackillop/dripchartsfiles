// src/api/integrations.js
// Temporary stub - Base44 integrations disabled during migration

export const Core = {
  InvokeLLM: async () => {
    console.warn('InvokeLLM not yet implemented in Railway backend');
    throw new Error('LLM integration not available');
  },
  SendEmail: async () => {
    console.warn('SendEmail not yet implemented in Railway backend');
    throw new Error('Email integration not available');
  },
  UploadFile: async () => {
    console.warn('UploadFile not yet implemented in Railway backend');
    throw new Error('File upload not available - use Railway backend');
  },
  GenerateImage: async () => {
    console.warn('GenerateImage not yet implemented in Railway backend');
    throw new Error('Image generation not available');
  },
  ExtractDataFromUploadedFile: async () => {
    console.warn('ExtractDataFromUploadedFile not yet implemented');
    throw new Error('File extraction not available');
  },
  CreateFileSignedUrl: async () => {
    console.warn('CreateFileSignedUrl not yet implemented');
    throw new Error('Signed URLs not available');
  },
  UploadPrivateFile: async () => {
    console.warn('UploadPrivateFile not yet implemented');
    throw new Error('Private file upload not available');
  },
};

export const InvokeLLM = Core.InvokeLLM;
export const SendEmail = Core.SendEmail;
export const UploadFile = Core.UploadFile;
export const GenerateImage = Core.GenerateImage;
export const ExtractDataFromUploadedFile = Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = Core.CreateFileSignedUrl;
export const UploadPrivateFile = Core.UploadPrivateFile;

export default Core;
