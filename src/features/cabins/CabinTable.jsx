import { useQuery } from "@tanstack/react-query";
import { getCabins } from "../../services/apiCabins";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useSearchParams } from "react-router-dom";


function CabinTable() {

  const [searchParams] = useSearchParams();
  const discount = searchParams.get("discount") || "all";
  console.log("DISCOUNT: ", discount);

  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins
  });

  if (cabins) {

    // 1) Filter
    let filterCabins;
    var sortedCabins;

    if (discount === "all") {
      filterCabins = cabins;
    }
    if (discount === "no-discount") {
      filterCabins = cabins.filter(cabinItem => {
        return cabinItem.discount === 0;
      });
    }
    if (discount === "with-discount") {
      filterCabins = cabins.filter(cabinItem => {
        return cabinItem.discount > 0;
      });
    }

    // 2) SORT
    const sortBy = searchParams.get("sortBy") || "startDate-asc";
    const [field, direction] = sortBy.split("-");
    const modifier = direction === "asc" ? 1 : -1;
    console.log("filterCabins 4", filterCabins);
    sortedCabins = filterCabins.sort(
      function (a, b) {
        return (a[field] - b[field]) * modifier;
      }
    );
  }

  if (isLoading) {
    return (<Spinner />)
  }

  return (
    <Menus>
      <Table role="table" columns={"0.6fr 1.8fr 2.2fr 1fr 1fr 1fr"}>
        <Table.Header role="row">
          <div></div>
          <div>CABIN</div>
          <div>CAPACITY</div>
          <div>PRICE</div>
          <div>DISCOUNT</div>
          <div></div>
        </Table.Header>

        {/* Cabin Listing Here. - Render Prop Pattern. */}
        <Table.Body
          data={sortedCabins}
          render={(cabin) => <CabinRow cabin={cabin} key={cabin.id} />} />

      </Table>
    </Menus>
  );
}

export default CabinTable
