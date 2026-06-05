import { IndexTable, type IndexTableColumn } from "@/components/index-table"

type Product = {
  id: string
  product: string
  sku: string
  inventory: string
}

const columns: IndexTableColumn<Product>[] = [
  { key: "product", header: "Product", sortable: true },
  { key: "sku", header: "SKU" },
  { key: "inventory", header: "Inventory", align: "end" },
]

export default function Example() {
  return (
    <IndexTable
      columns={columns}
      rows={[]}
      selectable
      loading
      loadingRowCount={5}
    />
  )
}
