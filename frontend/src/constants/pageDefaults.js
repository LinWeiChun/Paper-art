export const ADMIN_ITEMS_PER_PAGE = 10;

export const createDefaultArtForm = (overrides = {}) => ({
  title: '',
  artNumber: '',
  description: '',
  year: '',
  lengthCm: '',
  widthCm: '',
  heightCm: '',
  material: '',
  color: '',
  technique: '',
  creationPeriod: '',
  artworkType: '',
  remarks: '',
  sortOrder: 0,
  featured: false,
  rentable: true,
  published: true,
  authorIds: [],
  categoryIds: [],
  tagIds: [],
  ...overrides,
});

export const createDefaultAuthorForm = () => ({
  name: '',
  title: '',
  description: '',
  sortOrder: 0,
  published: true,
});

export const createDefaultNewsForm = () => ({
  title: '',
  date: '',
  summary: '',
  content: '',
});

export const createDefaultBannerForm = () => ({
  title: '',
  subtitle: '',
  sortOrder: 0,
  active: true,
});

export const createDefaultCategoryForm = () => ({
  name: '',
  sortOrder: 0,
  published: true,
});

export const createDefaultUserForm = () => ({
  username: '',
  password: '',
  enabled: true,
  roles: [],
});

export const createDefaultRentalRequestForm = () => ({
  name: '',
  phone: '',
  email: '',
  organization: '',
  startDate: '',
  endDate: '',
  message: '',
});

export const createDefaultContactForm = () => ({
  contactPerson: '',
  phone: '',
  mobile: '',
  email: '',
  address: '',
  facebook: '',
  instagram: '',
  line: '',
  website: '',
  businessHours: '',
  googleMap: '',
});

export const createDefaultContactMessageForm = () => ({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});
