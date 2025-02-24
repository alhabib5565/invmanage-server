import { EmpBookAssign } from './empBookAssign.model';

export const generateEmpBookAssignId = async () => {
  let currentId = '0';

  const lastEmpBookAssignId = await EmpBookAssign.findOne(
    {},
    { assignId: 1 },
  ).sort({
    createdAt: -1,
  });
  if (lastEmpBookAssignId) {
    currentId = lastEmpBookAssignId.assignId;
  }
  return (Number(currentId) + 1).toString().padStart(4, '0');
};
