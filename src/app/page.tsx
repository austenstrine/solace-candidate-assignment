'use client';

import { useEffect, useState } from 'react';
import type { AdvocateWithSpecialties } from '../db/types';

type PaginationInfo = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<AdvocateWithSpecialties[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 25,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [inputValue, setInputValue] = useState(''); // What user is typing
  const [searchTerm, setSearchTerm] = useState(''); // What was actually searched
  const [loading, setLoading] = useState(false);

  // Function to fetch advocates with pagination
  const fetchAdvocates = async (page: number, search: string = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if(search) {
        params.append('search', search);
      }

      console.log('fetching advocates...', { page, search });
      const response = await fetch(`/api/advocates?${params}`);
      const jsonResponse = await response.json();
      
      setAdvocates(jsonResponse.data);
      setPagination(jsonResponse.pagination);
    } 
		catch (error) {
      console.error('Error fetching advocates:', error);
    } 
		finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAdvocates(1);
  }, []);

  // Handle explicit search submission
  const handleSearchSubmit = () => {
    setSearchTerm(inputValue);
    fetchAdvocates(1, inputValue); // Reset to page 1 when searching
  };

  // Handle input change (just update the input, don't search yet)
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle Enter key press in search input
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Handle search button click (converted from reset)
  const onSearchClick = () => {
    handleSearchSubmit();
  };

  // Handle clearing search
  const onClearSearch = () => {
    setInputValue('');
    setSearchTerm('');
    fetchAdvocates(1, ''); // Reset search and go to page 1
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    fetchAdvocates(page, searchTerm);
  };

  const goToNextPage = () => {
    if(pagination.hasNextPage) {
      goToPage(pagination.page + 1);
    }
  };

  const goToPreviousPage = () => {
    if(pagination.hasPreviousPage) {
      goToPage(pagination.page - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50 px-3">
      <div className="solace-page-wrapper">
        <section className="section_solace-advocates-hero bg-white border-b border-gray-200">
          <div className="padding-global">
            <div className="solace-padding-section-large pt-16">
              <div className="solace-container-large max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight font-mollie">
                    Find Your Solace Advocate
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Connect with expert patient advocates who can help you navigate 
                    the healthcare system and solve any medical problem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="solace-main-wrapper">
          <section className="section_solace-advocates-search sticky top-0 z-20 py-4">
            <div className="padding-global">
              <div className="solace-container-large max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-md border border-gray-300 p-4">
                  <div className="flex gap-3 items-center">
                    <input
                      id="search"
                      type="text"
                      value={inputValue}
                      placeholder="Search advocates by name, city, degree, phone, or specialty..."
                      className={`
                        flex-1 px-4 py-3 border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-[#deb260] focus:border-[#deb260]
                        transition-all duration-300 text-sm
                        placeholder:text-gray-400
                      `}
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                    />
                    <button
                      onClick={onSearchClick}
                      className={`
                        px-6 py-3 bg-[#deb260] text-black rounded-lg
                        hover:bg-[#c9a055] transition-all duration-300
                        font-medium focus:ring-2 focus:ring-[#deb260] focus:ring-offset-2
                      `}
                    >
                      Search
                    </button>
                    {(inputValue || searchTerm) && (
                      <button
                        onClick={onClearSearch}
                        className={`
                          px-4 py-3 bg-[#3F937C] text-white rounded-lg
                          hover:bg-[#2d6b5a] transition-all duration-300
                          font-medium text-sm
                        `}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  {searchTerm && (
                    <div className="mt-3 text-sm text-gray-600">
											<>
												<span className="font-semibold text-[#deb260]">{advocates.length}</span> of{' '}
												<span className="font-semibold">{pagination.totalCount}</span> advocates
												{searchTerm && (
													<span> matching "{searchTerm}"</span>
												)}
											</>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="section_solace-advocates-results">
            <div className="padding-global">
              <div className="solace-container-large max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-300 overflow-hidden">
                  <div className="bg-[#3F937C] px-8 py-6">
                    <h3 className="text-xl font-semibold text-white font-mollie">
                      Healthcare Advocates
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                      Expert professionals ready to support your healthcare journey
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full overflow-hidden">
                      <thead className="bg-gray-50 border-b-2 border-gray-300">
                        <tr className="bg-gray-50">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            First Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            Last Name
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            City
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            Degree
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            Specialties
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-300">
                            Experience
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Phone
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-300">
                        {(loading || advocates.length === 0) 
													? (
														// Loading placeholder rows
														Array.from({ length: 25 }).map((_, index) => (
															<tr 
																key={`placeholder-${index}`}
																className={`
																	${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
																	animate-pulse border-b border-gray-300
																`}
															>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm font-medium border-r border-gray-300">
																	<div className="h-4 bg-gray-200 rounded w-20"></div>
																</td>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm border-r border-gray-300">
																	<div className="h-4 bg-gray-200 rounded w-24"></div>
																</td>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm border-r border-gray-300">
																	<div className="flex items-center">
																		<div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
																		<div className="h-4 bg-gray-200 rounded w-16"></div>
																	</div>
																</td>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap border-r border-gray-300">
																	<div className="h-6 bg-gray-200 rounded-full w-12"></div>
																</td>
																<td className="h-[155px] px-6 py-4 text-sm border-r border-gray-300">
																	<div className="flex flex-wrap gap-1.5">
																		<div className="h-6 bg-gray-200 rounded-md w-16"></div>
																		<div className="h-6 bg-gray-200 rounded-md w-20"></div>
																		<div className="h-6 bg-gray-200 rounded-md w-14"></div>
																	</div>
																</td>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm border-r border-gray-300">
																	<div className="flex items-center">
																		<div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
																		<div className="h-4 bg-gray-200 rounded w-16"></div>
																	</div>
																</td>
																<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm">
																	<div className="flex items-center">
																		<div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
																		<div className="h-4 bg-gray-200 rounded w-28"></div>
																	</div>
																</td>
															</tr>
														))
													) 
													: (
														advocates.map((advocate, index) => (
															<tr 
																key={advocate.id}
																className={`
																	hover:bg-amber-50 transition-all duration-300
																	${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}
																	group cursor-pointer border-b border-gray-300
																`}
															>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-[#deb260] transition-colors duration-300 border-r border-gray-300">
																{advocate.firstName}
															</td>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-[#deb260] transition-colors duration-300 border-r border-gray-300">
																{advocate.lastName}
															</td>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-300">
																<div className="flex items-center">
																	<svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
																		<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
																	</svg>
																	{advocate.city}
																</div>
															</td>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap border-r border-gray-300">
																<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#3F937C] text-white">
																	{advocate.degree}
																</span>
															</td>
															<td className="h-[155px] px-6 py-4 text-sm text-gray-900 border-r border-gray-300">
																<div className="flex flex-wrap gap-1.5">
																	{advocate.specialties
																		.sort((a, b) => a.name.localeCompare(b.name))
																		.map((specialty) => (
																			<span
																				key={specialty.id}
																				className={`
																					inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
																					bg-[#3F937C]/10 text-[#3F937C] border border-[#3F937C]/20
																					hover:bg-[#3F937C]/20 transition-colors duration-200
																				`}
																			>
																				{specialty.name}
																			</span>
																		))
																	}
																</div>
															</td>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-300">
																<div className="flex items-center">
																	<svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
																		<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
																	</svg>
																	<span className="font-medium">
																		{advocate.yearsOfExperience}
																	</span>
																	&nbsp;years
																</div>
															</td>
															<td className="h-[155px] px-6 py-4 whitespace-nowrap text-sm text-gray-700">
																<div className="flex items-center">
																	<svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
																		<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
																	</svg>
																	<span className="font-mono text-sm">
																		{advocate.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
																	</span>
																</div>
															</td>
														</tr>
														))
													)
												}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <section className="section_solace-pagination py-6 sticky bottom-0 z-10">
              <div className="padding-global">
                <div className="solace-container-large max-w-6xl mx-auto">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-300 px-4 py-4 sm:px-6">
                    {/* Mobile-first layout: stack vertically on small screens, side-by-side on larger screens */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Navigation buttons - centered on mobile, left-aligned on desktop */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                        <button
                          onClick={goToPreviousPage}
                          disabled={!pagination.hasPreviousPage}
                                                  className={`
                          px-4 py-2 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                          ${pagination.hasPreviousPage
                            ? 'bg-[#deb260] text-black hover:bg-[#c9a055]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        >
                          Previous
                        </button>
                        
                        <span className="text-xs sm:text-sm font-medium text-gray-700 px-2 sm:px-3 py-1 bg-gray-100 rounded whitespace-nowrap">
                          Page {pagination.page} of {pagination.totalPages}
                        </span>
                        
                        <button
                          onClick={goToNextPage}
                          disabled={!pagination.hasNextPage}
                                                  className={`
                          px-4 py-2 sm:px-6 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                          ${pagination.hasNextPage
                            ? 'bg-[#deb260] text-black hover:bg-[#c9a055]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          }
                        `}
                        >
                          Next
                        </button>
                      </div>
                      
                      {/* Results summary - centered on mobile, right-aligned on desktop */}
                      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{' '}
                        <span className="font-semibold text-[#deb260]">{pagination.totalCount}</span> results
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Empty Search Results Message */}
          {!loading && advocates.length === 0 && pagination.totalCount === 0 && searchTerm && (
            <section className="section_solace-empty py-8">
              <div className="padding-global">
                <div className="solace-container-large max-w-6xl mx-auto">
                  <div className="text-center bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="text-gray-500 text-lg mb-4">
                      No advocates found matching "{searchTerm}".
                    </div>
                    <button
                      onClick={onClearSearch}
                      className={`
                        px-6 py-2 bg-[#3F937C] text-white rounded-lg
                        hover:bg-[#2d6b5a] transition-all duration-300
                        font-medium
                      `}
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
