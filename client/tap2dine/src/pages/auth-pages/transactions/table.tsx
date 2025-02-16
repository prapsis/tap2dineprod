import { DataTable } from "../../../components/reusables/data-table";
import { columns } from "./column";
import { useFetchTransactions } from "../../../api/queries/transaction.query";
import TableFetchLoader from "../../../components/reusables/table-fetch-loader";

export default function TransactionTable() {
  const { data, isLoading } = useFetchTransactions();
  return isLoading ? (
      <TableFetchLoader/>
    ) : (
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
