import PageHeader from "../../../components/reusables/page-header";
import TransactionTable from "./table";


export default function TransactionPage() {
  return (
    <>
      <PageHeader title="Transactions" />
      <TransactionTable />
    </>
  )
}
