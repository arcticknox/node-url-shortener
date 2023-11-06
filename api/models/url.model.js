import mongoose from 'mongoose';

const urlSchema = mongoose.Schema(
    {
      originalUrl: {
        type: String,
        required: true,
        trim: true,
      },
      shortHash: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      expires: {
        type: Date,
        required: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
);

const UrlModel = mongoose.model('url', urlSchema);

export default UrlModel;
