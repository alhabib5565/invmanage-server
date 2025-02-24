import { PaymentRecord } from './paymentRecord.model';

const findLastPaymentId = async () => {
  const lastPaymentRecord = await PaymentRecord.findOne(
    {},
    { paymentId: 1, _id: 0 },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastPaymentRecord?.paymentId ? lastPaymentRecord.paymentId : undefined;
};

export const generatePaymentRecordId = async () => {
  let currentId = (0).toString();
  const lastPaymentRecordId = await findLastPaymentId();

  if (lastPaymentRecordId) {
    currentId = lastPaymentRecordId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `P-${incrementId}`;

  return incrementId;
};
