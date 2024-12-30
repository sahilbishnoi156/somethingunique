import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { UserType, CollegeType, ClubType } from '@/types/feed.types';
import { ClubItem } from './dashboard/club-item';
import { CollegeItem } from './dashboard/college-item';
import { UserItem } from './dashboard/user-item';
import { CreateCollegeDialog } from './dashboard/create-college';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function DataTable({
    data,
    tab,
    setRefetch,
}: {
    data: UserType[] | CollegeType[] | ClubType[];
    tab: string | null;
    setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [searchQuery, setSearchQuery] = useState<string | null>(
        null
    );
    const searchParams = useSearchParams();
    const search = searchParams.get('search');

    // Effect to read the search query from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('search') || '';
        setSearchQuery(query);
    }, [search]);

    // Effect to update the URL when searchQuery changes
    useEffect(() => {
        if (searchQuery) {
            const params = new URLSearchParams(
                window.location.search
            );
            params.set('search', searchQuery);
            window.history.replaceState(
                null,
                '',
                '?' + params.toString()
            );
        } else if (searchQuery === '') {
            const params = new URLSearchParams(
                window.location.search
            );
            params.delete('search');
            window.history.replaceState(
                null,
                '',
                '?' + params.toString()
            );
        }
    }, [searchQuery]);

    // Filter the data based on the search query
    const filteredData =
        data.length !== 0
            ? data.filter((item) => {
                  switch (tab) {
                      case 'admins':
                      case 'students':
                          const user = item as UserType;
                          return (
                              user?.username
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              user?.email
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  )
                          );
                      case 'colleges':
                          const college = item as CollegeType;
                          return (
                              college.name
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              college?.city
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              college?.state
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              college?.country
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  )
                          );
                      case 'clubs':
                          const club = item as ClubType;
                          return (
                              club?.status?.includes(
                                  searchQuery?.toLowerCase() || ''
                              ) ||
                              club.name
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              club.description
                                  ?.toLowerCase()
                                  ?.includes(
                                      searchQuery?.toLowerCase() || ''
                                  ) ||
                              (typeof club.college_id === 'string'
                                  ? ''
                                  : club.college_id?.name
                                        ?.toLowerCase()
                                        ?.includes(
                                            searchQuery?.toLowerCase() ||
                                                ''
                                        )) ||
                              (typeof club.admin === 'string'
                                  ? ''
                                  : club.admin?.username
                                        ?.toLowerCase()
                                        ?.includes(
                                            searchQuery?.toLowerCase() ||
                                                ''
                                        ))
                          );
                      default:
                          return true;
                  }
              })
            : [];

    const renderTableHeader = () => {
        switch (tab) {
            case 'admins':
            case 'students':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[60px]">
                            Sr No.
                        </TableHead>
                        <TableHead className="w-[100px]">
                            ID
                        </TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                );
            case 'colleges':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[60px]">
                            Sr No.
                        </TableHead>
                        <TableHead className="w-[100px]">
                            ID
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                );
            case 'clubs':
                return (
                    <TableRow className="rounded-xl border-t">
                        <TableHead className="w-[60px]">
                            Sr No.
                        </TableHead>
                        <TableHead className="w-[100px]">
                            ID
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>College</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                );
            default:
                return null;
        }
    };

    const renderTableBody = () => {
        return filteredData.map((item, index) => {
            switch (tab) {
                case 'admins':
                case 'students':
                    return (
                        <UserItem
                            user={item as UserType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                case 'colleges':
                    return (
                        <CollegeItem
                            college={item as CollegeType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                case 'clubs':
                    return (
                        <ClubItem
                            club={item as ClubType}
                            serialNumber={index + 1}
                            key={item._id}
                            setRefetch={setRefetch}
                        />
                    );
                default:
                    return null;
            }
        });
    };

    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchQuery(e.target.value);
    };

    const InputRef = React.useRef<HTMLInputElement>(null);
    return (
        <div>
            <div className="flex items-center justify-end mb-4 gap-5">
                <div
                    className="lg:w-1/3 md:w-3/4 w-full text-lg py-1.5 px-2 rounded-lg flex items-center gap-3 cursor-pointer border bg-secondary"
                    onClick={() => {
                        if (InputRef) {
                            InputRef.current?.focus();
                        }
                    }}
                >
                    <Search className="h-4 w-4 text-gray-500 dark:text-neutral-400" />

                    <input
                        type="text"
                        id="user-search-input"
                        className="peer p-0 w-full bg-transparent dark:bg-transparent dark:border-none dark:text-neutral-400 text-md placeholder:text-neutral-400 focus:ring-0 focus:outline-none"
                        placeholder="Search..."
                        ref={InputRef}
                        value={searchQuery || ''}
                        onChange={handleSearchChange}
                    />
                </div>
                {tab === 'colleges' && (
                    <CreateCollegeDialog setRefetch={setRefetch} />
                )}
            </div>
            {filteredData.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                    Nothing to show
                </div>
            ) : (
                <Table className="border rounded-xl">
                    <TableHeader>{renderTableHeader()}</TableHeader>
                    <TableBody>{renderTableBody()}</TableBody>
                </Table>
            )}
        </div>
    );
}
