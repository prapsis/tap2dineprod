import { useFetchIngredients } from "../../../api/queries/ingredients.query";
import PageHeader from "../../../components/reusables/page-header";
import IngredientStock from "../dashboard/_components/inventory";
import InventoryTable from "./table";


export default function InventoryPage() {
    const { data,isLoading } = useFetchIngredients();
  
  return (
    <>
      <PageHeader title="Inventory" />
      <IngredientStock data={data}/>
      <InventoryTable data={data} isLoading={isLoading}/>
    </>
  )
}
