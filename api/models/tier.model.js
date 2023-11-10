import mongoose from 'mongoose';

const tierSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        default: 'tier-3',
        enum: ['tier-1', 'tier-2', 'tier-3'],
      },
      requestsLimit: {
        type: Number,
        required: true,
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

const TierModel = mongoose.model('tier', tierSchema);

export default TierModel;
