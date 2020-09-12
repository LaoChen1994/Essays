import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    length: 200,
  })
  name: string;
  @Column({
    length: 200,
  })
  description: string;
  @Column("int")
  views: number;
  @Column({
    type: "boolean",
    nullable: false,
  })
  isPublished: boolean;

  constructor() {}
}
