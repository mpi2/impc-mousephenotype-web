import { orderBy } from "lodash";
import { useContext, useEffect, useState } from "react";
import {
  AlleleCell,
  OptionsCell,
  PlainTextCell,
  SmartTable,
} from "@/components/SmartTable";
import { GeneStatisticalResult } from "@/models/gene";
import { DownloadData, FilterBox } from "@/components";
import { AllelesStudiedContext, GeneContext } from "@/contexts";
import {
  MutantCountCell,
  ParameterCell,
  PhenotypeIconsCell,
  SignificantPValueCell,
  SupportingDataCell
} from './custom-cells';
import { orderPhenotypedSelectionChannel } from "@/eventChannels";
import { usePagination } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchAPI } from "@/api-service";
import { PaginatedResponse } from "@/models";

type Props = {
  routerIsReady: boolean;
};

const AllData = (props: Props) => {
  const gene = useContext(GeneContext);
  const [sorted, setSorted] = useState<Array<GeneStatisticalResult>>([]);
  const [procedure, setProcedure] = useState(undefined);
  const [query, setQuery] = useState(undefined);
  const [system, setSystem] = useState(undefined);
  const [selectedLifeStage, setSelectedLifeStage] = useState<string>(undefined);
  const [selectedZygosity, setSelectedZygosity] = useState<string>(undefined);
  const [selectedAllele, setSelectedAllele] = useState<string>(undefined);
  const [totalItems, setTotalItems] = useState<number>(0);

  const {
    activePage,
    pageSize,
    setActivePage,
    setPageSize,
  } = usePagination();


  const { data, isError, isFetching } = useQuery({
    queryKey: ['statistical-result', gene.mgiGeneAccessionId, activePage, pageSize],
    queryFn: () => {
      let url = `/api/v1/genes/statistical-result/filtered/page?mgiGeneAccessionId=${gene.mgiGeneAccessionId}&page=${activePage}&size=${pageSize}`;
      return fetchAPI(url);
    },
    select: response => response as PaginatedResponse<GeneStatisticalResult>,
  });

  const { data: filterData } = useQuery({
    queryKey: ['filterData', gene.mgiGeneAccessionId],
    queryFn: () => fetchAPI(`/api/v1/genes/${gene.mgiGeneAccessionId}/dataset/get_filter_data`),
  });


  useEffect(() => {
    if (data) {
      setSorted(orderBy<GeneStatisticalResult>(data.content, "pValue", "asc"));
      if (data.totalElements !== totalItems) {
        setTotalItems(data.totalElements);
      }
    }
  }, [data, totalItems]);

  useEffect(() => {
    if (filterData) {
      console.log('ON EFFECT');
      console.log(filterData);
    }
  }, [filterData]);

  useEffect(() => {
    const unsubscribeOnAlleleSelection = orderPhenotypedSelectionChannel.on(
      "onAlleleSelected",
      (newAllele) => {
        if (newAllele !== selectedAllele) {
          setSelectedAllele(newAllele);
        }
      });
    return () => {
      unsubscribeOnAlleleSelection();
    }
  }, [selectedAllele]);

  const sortPhenotypes = (data: Array<GeneStatisticalResult>, field: keyof GeneStatisticalResult, order: "asc" | "desc") => {
    if (field === "pValue") {
      return data.sort((p1, p2) => {
        const p1PValue = parseFloat(p1.pValue);
        const p2PValue = parseFloat(p2.pValue);
        if (!p1PValue) {
          return 1;
        } else if (!p2PValue) {
          return -1;
        }
        return order === "asc" ? p1PValue - p2PValue : p2PValue - p1PValue;
      });
    }
    return orderBy(data, field, order);
  };

  if (!data) {
    return null;
  }

  return (
    <SmartTable<GeneStatisticalResult>
      data={sorted}
      defaultSort={["pValue", "asc"]}
      customFiltering
      customSortFunction={sortPhenotypes}
      additionalBottomControls={
        <DownloadData<GeneStatisticalResult>
          data={sorted}
          fileName={`${gene.geneSymbol}-all-phenotype-data`}
          fields={[
            { key: "alleleSymbol", label: "Allele" },
            { key: "phenotypingCentre", label: "Phenotyping center" },
            { key: "procedureName", label: "Procedure" },
            { key: "parameterName", label: "Parameter" },
            { key: "zygosity", label: "Zygosity" },
            {
              key: "femaleMutantCount",
              label: "Female mutant count",
              getValueFn: (item) =>
                item?.femaleMutantCount?.toString() || "0",
            },
            {
              key: "maleMutantCount",
              label: "Male mutant count",
              getValueFn: (item) =>
                item?.maleMutantCount?.toString() || "N/A",
            },
            { key: "lifeStageName", label: "Life stage" },
            {
              key: "significant",
              label: "Significant",
              getValueFn: (item) => (item.significant ? "Yes" : "No"),
            },
            {
              key: "pValue",
              label: "Most significant P-value",
              getValueFn: (item) => item?.pValue?.toString() || "N/A",
            },
          ]}
        />
      }
      pagination={{
        totalItems,
        onPageChange: setActivePage,
        onPageSizeChange: setPageSize,
        page: activePage,
        pageSize
      }}
      columns={[
        {
          width: 2,
          label: "Procedure/parameter",
          field: "procedureName",
          cmp: <ParameterCell />,
        },
        {
          width: 1,
          label: "Supporting data",
          cmp: <SupportingDataCell />,
        },
        {
          width: 0.8,
          label: "System",
          field: "topLevelPhenotypes",
          cmp: <PhenotypeIconsCell allPhenotypesField="topLevelPhenotypes" />,
        },
        {
          width: 1,
          label: "Allele",
          field: "alleleSymbol",
          cmp: <AlleleCell />,
        },
        {
          width: 1,
          label: "Zygosity",
          field: "zygosity",
          cmp: <PlainTextCell style={{ textTransform: "capitalize" }} />,
        },
        {
          width: 1,
          label: "Life stage",
          field: "lifeStageName",
          cmp: <PlainTextCell />,
        },
        {
          width: 1,
          label: "Center",
          field: "phenotypingCentre",
          cmp: <PlainTextCell />,
        },
        {
          width: 0.7,
          label: "Mutants",
          field: "mutantCount",
          cmp: <MutantCountCell />,
        },
        {
          width: 0.5,
          label: "Significant",
          field: "significant",
          cmp: <OptionsCell options={{ true: "Yes", false: "No" }} />,
        },
        { width: 1, label: "P value", field: "pValue", cmp: <SignificantPValueCell /> },
      ]}
      highlightRowFunction={(item) =>
        item.maleMutantCount < item.procedureMinMales && item.femaleMutantCount < item.procedureMinFemales
      }
    />
  );
};

export default AllData;
