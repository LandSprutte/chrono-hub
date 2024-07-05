"ues client";
export const DeleteAction = ({ id, onDelete }: any) => {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await deleteTimesheet(timesheet.id);
      }}
      className="text-red-500 focus:bg-red-100 focus:text-red-500 focus:font-semibold"
    >
      delete
    </DropdownMenuItem>
  );
};
