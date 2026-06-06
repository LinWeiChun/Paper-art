import { useSearchParams } from 'react-router-dom';

function usePagination(data, pageSize = 12) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.ceil(data.length / pageSize);

  const pagedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    params.set('page', page);

    setSearchParams(params);
  };

  return {
    currentPage,
    totalPages,
    pagedData,
    handlePageChange,
  };
}

export default usePagination;