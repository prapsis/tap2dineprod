import { DataTable } from "../../../components/reusables/data-table";
import { columns } from "./column";
import { useFetchTransactions } from "../../../api/queries/transaction.query";

export default function TransactionTable() {
  const { data } = useFetchTransactions();
  console.log(data);
  return (
    <div>
      <DataTable
        columns={columns}
        data={data || []}
        functions={{
          search: {
            name: "name",
            placeholder: "Search by Customer Name...",
          },
        }}
      />
    </div>
  );
}
