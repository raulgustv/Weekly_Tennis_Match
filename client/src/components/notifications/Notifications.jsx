import React, { useEffect, useState } from "react";
import {
  Tour,
  Badge,
  Button,
  Modal,
  Tag,
  Space,
  Typography,
  Empty,
  Divider,
} from "antd";
import {
  BellOutlined,
  NotificationOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { useNotifications } from "../../hooks/useNotifications";
import {
  NOTIFICATION_STYLES,
  TAG_STYLES,
} from "../../helpers/NotificationColors";

const { Text, Paragraph, Title } = Typography;

const Notifications = ({ user, isMobile = false }) => {
  const {
    tourUnseen,
    updatesUnseen,
    markSeen,
    clearAll,
  } = useNotifications(user);

  const [tourOpen, setTourOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);

  /*
   * ================= TOUR =================
   *
   * Los tours aparecen automáticamente centrados.
   */
  useEffect(() => {
    if (!user || tourUnseen.length === 0) return;

    const timer = setTimeout(() => {
      setTourOpen(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [user, tourUnseen.length]);

  if (!user) return null;

  const closeTour = () => {
    if (tourUnseen.length > 0) {
      markSeen(tourUnseen.map((n) => n._id));
    }

    setTourOpen(false);
  };

  /*
   * ================= INBOX =================
   *
   * Al abrir la campana solo se muestra lo pendiente.
   * Ya NO se marca como visto automáticamente: el usuario
   * decide con "Marcar todo como leído" o descartando
   * una por una.
   */
  const openInbox = () => {
    setInboxOpen(true);
  };

  const dismissOne = (id) => {
    markSeen([id]);
  };

  /*
   * ================= TOUR STEPS =================
   *
   * target: null hace que Ant Design coloque
   * el Tour centrado en pantalla.
   */
  const steps = tourUnseen.map((n) => {
    const typeStyle =
      NOTIFICATION_STYLES[n.type] ||
      NOTIFICATION_STYLES.tour;

    const tagStyle =
      TAG_STYLES[n.tag] ||
      TAG_STYLES.New;

    return {
      title: (
        <Space size={8}>
          <NotificationOutlined
            style={{
              color: typeStyle.color,
            }}
          />

          <span>{n.title}</span>
        </Space>
      ),

      description: (
        <Space
          orientation="vertical"
          size={12}
          style={{
            width: "100%",
          }}
        >
          {n.tag && (
            <Tag
              style={{
                marginInlineEnd: 0,
                color: tagStyle.color,
                background: tagStyle.background,
                borderColor: tagStyle.border,
              }}
            >
              {n.tag}
            </Tag>
          )}

          <Text type="secondary">
            {n.description}
          </Text>
        </Space>
      ),

      // Tour independiente de cualquier elemento.
      // Ant Design lo muestra centrado.
      target: null,
    };
  });

  return (
    <>
      {/* ================= NOTIFICATION BUTTON ================= */}

      <Badge
        count={updatesUnseen.length}
        size="small"
        overflowCount={99}
        offset={[-3, 3]}
      >
        <Button
          id="notifications-button"
          type="text"
          onClick={openInbox}
          aria-label="Ver notificaciones"
          style={{
            height: 38,
            minWidth: 38,
            padding: "0 10px",
            borderRadius: 10,
            color: "#fff",
            background: "rgba(255,255,255,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <BellOutlined
            style={{
              fontSize: 18,
              color: "#fff",
            }}
          />

          {!isMobile && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              What's new?
            </span>
          )}
        </Button>
      </Badge>

      {/* ================= TOUR ================= */}

      <Tour
        open={tourOpen}
        onClose={closeTour}
        onFinish={closeTour}
        steps={steps}
        type="default"
        styles={{
          mask: {
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          },

          popover: {
            width: isMobile
              ? "calc(100vw - 24px)"
              : 700,

            maxWidth: "calc(100vw - 24px)",
          },
        }}
      />

      {/* ================= INBOX ================= */}

      <Modal
        open={inboxOpen}
        onCancel={() => setInboxOpen(false)}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={500}
        centered
        title={
          <Space
            size={10}
            style={{
              width: "100%",
              justifyContent: "space-between",
              paddingRight: 28,
            }}
          >
            <Space size={10}>
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#F1F4F7",
                  flexShrink: 0,
                }}
              >
                <BellOutlined
                  style={{
                    fontSize: 18,
                    color: "#52616B",
                  }}
                />
              </span>

              <div>
                <Title
                  level={4}
                  style={{
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Novedades
                </Title>

                <Text
                  type="secondary"
                  style={{
                    fontSize: 12,
                  }}
                >
                  Latest news & updates
                </Text>
              </div>
            </Space>

            {updatesUnseen.length > 0 && (
              <Button
                type="link"
                size="small"
                onClick={clearAll}
                style={{ padding: 0 }}
              >
                Marcar todo como leído
              </Button>
            )}
          </Space>
        }
      >
        {updatesUnseen.length === 0 ? (
          <div
            style={{
              padding: "36px 0 24px",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary">
                  No hay novedades por ahora
                </Text>
              }
            />
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              marginTop: 12,
            }}
          >
            {updatesUnseen.map((n, index) => {
              const typeStyle =
                NOTIFICATION_STYLES[n.type] ||
                NOTIFICATION_STYLES.update;

              const tagStyle =
                TAG_STYLES[n.tag] ||
                TAG_STYLES.New;

              return (
                <React.Fragment key={n._id}>
                  <div
                    style={{
                      padding: "16px 4px",
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flex: "0 0 auto",
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: typeStyle.background,
                        border: `1px solid ${typeStyle.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <NotificationOutlined
                        style={{
                          fontSize: 17,
                          color: typeStyle.color,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Space
                        size={8}
                        wrap
                        style={{
                          marginBottom: 5,
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Space size={8} wrap>
                          <Text strong>
                            {n.title}
                          </Text>

                          {n.tag && (
                            <Tag
                              style={{
                                marginInlineEnd: 0,
                                borderRadius: 6,
                                color: tagStyle.color,
                                background: tagStyle.background,
                                borderColor: tagStyle.border,
                              }}
                            >
                              {n.tag}
                            </Tag>
                          )}
                        </Space>

                        <Button
                          type="text"
                          size="small"
                          icon={<CloseOutlined style={{ fontSize: 12 }} />}
                          onClick={() => dismissOne(n._id)}
                          aria-label="Descartar notificación"
                          style={{
                            width: 22,
                            height: 22,
                            minWidth: 22,
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                      </Space>

                      <Paragraph
                        type="secondary"
                        style={{
                          margin: 0,
                          fontSize: 13,
                          lineHeight: 1.55,
                        }}
                      >
                        {n.description}
                      </Paragraph>
                    </div>
                  </div>

                  {index < updatesUnseen.length - 1 && (
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Notifications;