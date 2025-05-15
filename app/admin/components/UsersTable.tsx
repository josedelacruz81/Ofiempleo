"use client";
import { userInterface, userTypeInterface } from "@/types";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import {
  HiOutlineBan,
  HiOutlineDotsVertical,
  HiOutlineSearch,
  HiOutlineTrash,
} from "react-icons/hi";
import { BanModal } from "./BanModal";
import { capitalizeFirstLetter } from "@/lib/functions";
import { useToast } from "@/components/shadCn/useToast";
import { VerificationModal } from "@/components/modals/VerificationModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function UsersTable() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set([""]));

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { onOpen, onClose, isOpen, onOpenChange } = useDisclosure();
  const [isOpenVerification, setIsOpenVerification] = useState(false);
  const { toast } = useToast();
  const handleOpen = (userId: string) => {
    setSelectedKeys(new Set([userId]));
    if (!selectedKeys.size) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ningún usuario",
        className: "border border-warning bg-yellow-50 text-warning",
        variant: "destructive",
      });
      return;
    }
    onOpen();
  };
  let list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.

      const response = await fetch(
        cursor || `/api/admin/users?_start=0&_end=15`
      );
      let data = await response.json();

      setHasMore(data.next !== null);

      return {
        items: data.result,
        cursor: data.next,
      };
    },
  });

  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });

  const columns = [
    {
      key: "names",
      label: "Nombres",
    },

    {
      key: "email",
      label: "Correo",
    },
    {
      key: "phone",
      label: "Teléfono",
    },
    {
      key: "created_at",
      label: "Fecha de registro",
    },
    {
      key: "isBanned",
      label: "Estado",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          className: "border border-warning bg-yellow-50 text-warning",
          variant: "destructive",
          
        });
        return;
      }
      toast({
        title: "Eliminado",
        description: data.message,
        className: "border border-success bg-green-50 text-success",
        variant: "destructive",
      });
     
      onClose();
    } catch (error) {
     
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCell = useCallback((user: userInterface, columnKey: string) => {
    //@ts-ignore
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "names":
        return (
          <User
            avatarProps={{ src: user.profileImage, name: user.names }}
            description={user.email}
            name={capitalizeFirstLetter(`${user.names} ${user.lastname}`)}
          >
            {user.email}
          </User>
        );
      case "created_at":
        return new Date(cellValue).toLocaleDateString();
      case "isBanned":
        return (
          <Tooltip
            content={
              <div className="w-52">
                <div>
                  {user.isBanned ? (
                    <div>
                      {user.banFinishDate ? (
                        <>
                          <h4>
                            Esta es la fecha de finalización de la penalización:
                          </h4>
                          <p>
                            {new Date(user.banFinishDate).toLocaleDateString()}
                          </p>
                        </>
                      ) : (
                        "Su penalización es permanente"
                      )}
                    </div>
                  ) : (
                    <p>El usuario no está penalizado</p>
                  )}
                </div>
              </div>
            }
          >
            <button
              className={`${
                user.isBanned ? "bg-danger-500" : "bg-primary"
              } h-4 w-4 rounded-full`}
            >
              {cellValue}
            </button>
          </Tooltip>
        );

      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button color="primary" variant="light" size="sm" isIconOnly>
                <HiOutlineDotsVertical size={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                color="warning"
                variant="light"
                className="text-warning"
                startContent={<HiOutlineBan size={18} />}
                onPress={() => handleOpen(user.id)}
              >
                Banear
              </DropdownItem>

              <DropdownItem
                className="text-danger"
                color="danger"
                onClick={() => {
                  setSelectedKeys(new Set([user.id]));
                  setIsOpenVerification(true);
                }}
                startContent={<HiOutlineTrash />}
              >
                Eliminar
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <Card>
        <CardBody>
          <Table
            color="primary"
            baseRef={scrollerRef}
            selectionMode="single"
            selectedKeys={selectedKeys}
            disabledBehavior="all"
            //@ts-ignore
            onSelectionChange={setSelectedKeys}
            aria-label="Example static collection table"
            isHeaderSticky
            bottomContent={
              hasMore ? (
                <div className="flex w-full justify-center">
                  <Spinner ref={loaderRef} color="primary" />
                </div>
              ) : null
            }
            shadow="none"
            classNames={{
              base: "max-h-[38rem]  scrollCard border-none p-0",
              table: "min-h-[38rem] scrollCard",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              isLoading={isLoading}
              items={list.items as userInterface[]}
            >
              {(item: userInterface) => (
                <TableRow key={item.id}>
                  {(columnKey:any) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <BanModal
        key="Ban"
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
        //ts-ignore
        selectedUser={
          list.items.filter((item) => {
            const array = Array.from(selectedKeys);
            //@ts-ignore
            return item.id === parseInt(array[0]);
          })[0]
        }
      />
      <ConfirmDeleteModal
        onClose={() => setIsOpenVerification(false)}
        isLoading={isDeleting}
        handleDeleteUser={handleDeleteUser}
        isOpenVerification={isOpenVerification}
        selectedUser={
          list.items.filter((item) => {
            const array = Array.from(selectedKeys);
            //@ts-ignore
            return item.id === parseInt(array[0]);
          })[0]
        }
        setIsOpenVerification={setIsOpenVerification}
      />
    </>
  );
}
