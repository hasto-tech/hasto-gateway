import { Schema } from 'mongoose';

export const IdentitySchema = new Schema({
  ethereumAddress: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  pins: {
    type: Array,
    required: true,
    default: [],
  },
  unpins: {
    type: Array,
    required: true,
    default: [],
  },
  availableTransfer: {
    type: Number,
    required: true,
    default: 0,
  },
  usedTransfer: {
    type: Number,
    required: true,
    default: 0,
  },
  proxyEnsName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
    index: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    index: true,
  },
});
