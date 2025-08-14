// Mock implementation of a Document entity that uses localStorage.

const DOC_KEY = 'documents';

const getDocs = () => {
  try {
    const docs = localStorage.getItem(DOC_KEY);
    return docs ? JSON.parse(docs) : [];
  } catch (e) {
    return [];
  }
};

const saveDocs = (docs) => {
  localStorage.setItem(DOC_KEY, JSON.stringify(docs));
};

export const Document = {
  async create(data) {
    const docs = getDocs();
    const newDoc = {
      id: `doc_${Date.now()}`,
      ...data,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    docs.push(newDoc);
    saveDocs(docs);
    return newDoc;
  },

  async update(id, data) {
    let docs = getDocs();
    const docIndex = docs.findIndex(d => d.id === id);
    if (docIndex > -1) {
      docs[docIndex] = { ...docs[docIndex], ...data, updated_date: new Date().toISOString() };
      saveDocs(docs);
      return docs[docIndex];
    }
    return null;
  },

  async filter(query) {
    const docs = getDocs();
    const [key, value] = Object.entries(query)[0];
    return docs.filter(doc => doc[key] === value);
  },

  async list(sort = '-created_date', limit = 50) {
    const docs = getDocs();
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? -1 : 1;

    docs.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * sortOrder;
      if (a[sortField] > b[sortField]) return 1 * sortOrder;
      return 0;
    });

    return docs.slice(0, limit);
  },
};
