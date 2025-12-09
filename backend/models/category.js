import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '' },
}, 
{ timestamps: true });

// Auto-generate slug from name if missing
categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

categorySchema.index({ slug: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
