#include <stdio.h>
#include <stdlib.h>

typedef struct Node
{
  int value;
  struct Node *next;
} Node;

typedef struct
{
  Node *head;
  Node *tail;
  int size;
} LinkedList;

void prepend(Node *node, LinkedList *linkedList);
void append(Node *node, LinkedList *linkedList);
void print(LinkedList *linkedList);
void dealloc(LinkedList *linkedList);

int main(void)
{

  // initialize our linkedList
  LinkedList *linkedList = malloc(sizeof(LinkedList));
  if (linkedList == NULL)
  {
    return 1;
  }
  linkedList->head = NULL;
  linkedList->tail = NULL;
  linkedList->size = 0;

  // append 0-7, should print out 0-7
  // for (int i = 0; i < 8; i++)
  // {
  //   Node *node = malloc(sizeof(Node));
  //   if (node == NULL)
  //   {
  //     return 1;
  //   }
  //   node->value = i;
  //   append(node, linkedList);
  // }

  // prepend 0-7, should print out 7-0
  for (int i = 0; i < 8; i++)
  {
    Node *node = malloc(sizeof(Node));
    if (node == NULL)
    {
      return 1;
    }
    node->value = i;
    prepend(node, linkedList);
  }

  // print the array
  print(linkedList);

  // free memory
  dealloc(linkedList);
  return 0;
}

void prepend(Node *node, LinkedList *linkedList)
{
  if (linkedList->size == 0)
  {
    linkedList->head = node;
    linkedList->tail = node;
    node->next = NULL;
  }
  else
  {
    node->next = linkedList->head;
    linkedList->head = node;
  }
  linkedList->size += 1;
}

void append(Node *node, LinkedList *linkedList)
{
  if (linkedList->size == 0)
  {
    linkedList->head = node;
    linkedList->tail = node;
  }
  else
  {
    linkedList->tail->next = node;
    linkedList->tail = node;
  }

  node->next = NULL;
  linkedList->size += 1;
}

void print(LinkedList *linkedList)
{
  Node *head = linkedList->head;
  while (head != NULL)
  {
    printf("0x: %p | value: %i\n", head, head->value);
    head = head->next;
  }
}

void dealloc(LinkedList *linkedList)
{

  Node *ptr = linkedList->head;
  while (ptr != NULL)
  {
    Node *tmp = ptr;
    ptr = ptr->next;
    free(tmp);
  }
  free(linkedList);
}