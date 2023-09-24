export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      friends: {
        Row: {
          profile_id_1: string;
          profile_id_2: string;
        };
        Insert: {
          profile_id_1?: string;
          profile_id_2: string;
        };
        Update: {
          profile_id_1?: string;
          profile_id_2?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friends_profile_id_1_fkey";
            columns: ["profile_id_1"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friends_profile_id_2_fkey";
            columns: ["profile_id_2"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      games: {
        Row: {
          created_at: string;
          id: string;
          match_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          match_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          match_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "games_match_id_fkey";
            columns: ["match_id"];
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      matches_profiles: {
        Row: {
          match_id: string;
          user_id: string;
        };
        Insert: {
          match_id: string;
          user_id?: string;
        };
        Update: {
          match_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_profiles_match_id_fkey";
            columns: ["match_id"];
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          janreco_id: string | null;
          name: string | null;
        };
        Insert: {
          id: string;
          janreco_id?: string | null;
          name?: string | null;
        };
        Update: {
          id?: string;
          janreco_id?: string | null;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      rules: {
        Row: {
          calc_method: string;
          chip_rate: number;
          crack_box_bonus: number;
          created_at: string;
          created_by: string;
          default_calc_points: number;
          default_points: number;
          id: string;
          incline: string;
          match_id: string;
          players_count: number;
          rate: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          calc_method: string;
          chip_rate: number;
          crack_box_bonus: number;
          created_at?: string;
          created_by?: string;
          default_calc_points: number;
          default_points: number;
          id?: string;
          incline: string;
          match_id: string;
          players_count: number;
          rate: number;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          calc_method?: string;
          chip_rate?: number;
          crack_box_bonus?: number;
          created_at?: string;
          created_by?: string;
          default_calc_points?: number;
          default_points?: number;
          id?: string;
          incline?: string;
          match_id?: string;
          players_count?: number;
          rate?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rules_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rules_match_id_fkey";
            columns: ["match_id"];
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "rules_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      scores: {
        Row: {
          game_id: string;
          id: string;
          score: number;
          user_id: string;
        };
        Insert: {
          game_id: string;
          id?: string;
          score: number;
          user_id: string;
        };
        Update: {
          game_id?: string;
          id?: string;
          score?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "scores_game_id_fkey";
            columns: ["game_id"];
            referencedRelation: "games";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "scores_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      delete_friends: {
        Args: {
          profile_id: string;
        };
        Returns: undefined;
      };
      get_friends: {
        Args: Record<PropertyKey, never>;
        Returns: {
          id: string;
          name: string;
          janreco_id: string;
        }[];
      };
      search_profiles: {
        Args: {
          search_text: string;
        };
        Returns: {
          id: string;
          name: string;
          janreco_id: string;
          is_friend: boolean;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey";
            columns: ["owner"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: unknown;
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
