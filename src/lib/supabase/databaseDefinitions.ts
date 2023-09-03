export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			relatives: {
				Row: {
					birthyear: number | null;
					childof: string | null;
					created_at: string;
					description: string | null;
					firstname: string | null;
					generation: number | null;
					id: string;
					lastname: string | null;
					partnerto: string | null;
				};
				Insert: {
					birthyear?: number | null;
					childof?: string | null;
					created_at?: string;
					description?: string | null;
					firstname?: string | null;
					generation?: number | null;
					id: string;
					lastname?: string | null;
					partnerto?: string | null;
				};
				Update: {
					birthyear?: number | null;
					childof?: string | null;
					created_at?: string;
					description?: string | null;
					firstname?: string | null;
					generation?: number | null;
					id?: string;
					lastname?: string | null;
					partnerto?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
