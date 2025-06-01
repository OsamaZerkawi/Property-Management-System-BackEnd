import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1748768844200 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
          name: "users",
          columns: [
            {
              name: "id",
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: "increment"
            },
            {
              name: "first_name",
              type: "varchar",
              length: "255"
            },
            {
              name: "last_name",
              type: "varchar",
              length: "255"
            },
            {
              name: "phone",
              type: "varchar",
              isUnique: true
            },
            {
              name: "password",
              type: "varchar"
            },
            {
              name: "email",
              type: "varchar",
              isUnique: true
            },
            {
              name: "role",
              type: "enum",
              enum: ["admin", "user", "property_manager"],
              enumName: "user_role_enum", // recommended to name the enum type
              default: `'user'` 
            },
            {
              name: "photo",
              type: "varchar",
              isNullable: true
            },
            {
              name: "stripe_customer_id",
              type: "varchar",
              isNullable: true
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP"
            },
            {
              name: "updated_at",
              type: "timestamp",
              default: "CURRENT_TIMESTAMP"
            }
          ]
        }));
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
      }

}
