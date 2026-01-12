import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Close,
  Person,
  ShoppingCart,
  SupervisorAccount,
  Email,
  Logout,
  PersonAdd,
  Login,
  CatchingPokemon,
  Casino,
  Map,
  Collections,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../../router/routesModel";
import useHandleUsers from "../../../users/hooks/useHandleUsers";
import { useUser } from "../../../users/providers/UserProvider";

const Menu = ({ isOpen, anchorEl, onClose }) => {
  const { user } = useUser();
  const { handleLogout } = useHandleUsers();
  const navigate = useNavigate();

  const handleMenuLogout = () => {
    handleLogout();
    navigate(ROUTES.POKEMON_CARDS, { replace: true });
    onClose();
  };

  const handleNavigate = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        display: { xs: "block", md: "none" },
        "& .MuiDrawer-paper": {
          width: 320,
          background: "linear-gradient(180deg, #ffffff 0%, #faf8f5 100%)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </IconButton>

        {user ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 1 }}>
            <Avatar
              src={user.image?.url || user.image?.alt}
              sx={{
                width: 56,
                height: 56,
                border: "3px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {user.name?.first} {user.name?.last}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Cardonomer
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Trading Card Community
            </Typography>
          </Box>
        )}
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List sx={{ px: 1, py: 2 }}>
          {user ? (
            // Logged in menu
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(`${ROUTES.PROFILE}/${user._id}`)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.08)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Person sx={{ color: "#667eea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Profile"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(ROUTES.CART)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.08)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ShoppingCart sx={{ color: "#667eea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Shopping Cart"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {user.isAdmin && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2,
                      py: 1,
                      fontWeight: 700,
                      color: "text.secondary",
                      display: "block",
                    }}
                  >
                    ADMIN TOOLS
                  </Typography>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigate(ROUTES.ADMIN)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        transition: "all 0.2s",
                        bgcolor: "rgba(211, 47, 47, 0.05)",
                        "&:hover": {
                          bgcolor: "rgba(211, 47, 47, 0.12)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <SupervisorAccount sx={{ color: "#d32f2f" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Users Management"
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#d32f2f",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigate(ROUTES.ADMIN_EMAILS)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        transition: "all 0.2s",
                        bgcolor: "rgba(211, 47, 47, 0.05)",
                        "&:hover": {
                          bgcolor: "rgba(211, 47, 47, 0.12)",
                          transform: "translateX(4px)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Email sx={{ color: "#d32f2f" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Management"
                        primaryTypographyProps={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "#d32f2f",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <Divider sx={{ my: 1.5 }} />
                </>
              )}
            </>
          ) : (
            // Not logged in menu
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(ROUTES.SIGNUP)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.08)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PersonAdd sx={{ color: "#667eea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Sign Up"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(ROUTES.LOGIN)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "rgba(102, 126, 234, 0.08)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Login sx={{ color: "#667eea" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Log In"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider sx={{ my: 1.5 }} />
            </>
          )}

          {/* Common menu items */}
          <Typography
            variant="caption"
            sx={{
              px: 2,
              py: 1,
              fontWeight: 700,
              color: "text.secondary",
              display: "block",
            }}
          >
            EXPLORE
          </Typography>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(ROUTES.MAP)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Map sx={{ color: "#667eea" }} />
              </ListItemIcon>
              <ListItemText
                primary="Collector Map"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(ROUTES.POKEMON_TCG_BROWSER)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Collections sx={{ color: "#667eea" }} />
              </ListItemIcon>
              <ListItemText
                primary="TCG Browser"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(ROUTES.POKEMON_CARDS)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <CatchingPokemon sx={{ color: "#667eea" }} />
              </ListItemIcon>
              <ListItemText
                primary="Pokémon Decks"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(ROUTES.POKEMON_CARDS)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.08)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Casino sx={{ color: "#667eea" }} />
              </ListItemIcon>
              <ListItemText
                primary="Yu-Gi-Oh! TCG"
                secondary="Coming Soon"
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
                secondaryTypographyProps={{
                  fontSize: "0.7rem",
                  fontStyle: "italic",
                }}
              />
            </ListItemButton>
          </ListItem>

          {user && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleMenuLogout}
                  sx={{
                    borderRadius: 2,
                    transition: "all 0.2s",
                    bgcolor: "rgba(211, 47, 47, 0.05)",
                    "&:hover": {
                      bgcolor: "rgba(211, 47, 47, 0.12)",
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Logout sx={{ color: "#d32f2f" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Log Out"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#d32f2f",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          background: "linear-gradient(135deg, #f5e6c8 0%, #ead9b5 100%)",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            display: "block",
            color: "#7a6a54",
            fontWeight: 500,
          }}
        >
          © 2026 Cardonomer
        </Typography>
      </Box>
    </Drawer>
  );
};

export default Menu;
